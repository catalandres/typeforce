"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var xml2js_1 = require("xml2js");
var wsdlFolder = './wsdl/resources';
var outputFolder = './output';
fs.readdirSync(wsdlFolder).forEach(function (wsdlFile) {
    console.dir(wsdlFile);
    var fileName = wsdlFile.split('.')[0];
    var extension = wsdlFile.split('.')[1];
    if (extension == 'wsdl') {
        var wsdl = fs.readFileSync(wsdlFolder + '/' + wsdlFile, 'utf-8');
        var ts = convertWsdlToTypescript(wsdl);
        fs.writeFileSync(outputFolder + '/' + fileName + '.d.ts', ts);
    }
});
function convertWsdlToTypescript(wsdl) {
    var output = '';
    (0, xml2js_1.parseString)(wsdl
        // Remove the xsd namespace prefix, because partner.wsdl does not use it.
        .replaceAll('xsd:', '')
        // Transform the namespace prefixes, to make them Typescript friendly.
        .replaceAll('tns:', 'tns_')
        .replaceAll('ens:', 'ens_')
        .replaceAll('mns:', 'mns_')
        .replaceAll('fns:', 'fns_')
        .replaceAll('soap:', 'soap_')
        .replaceAll('xmlns:', 'xmlns_'), {
        explicitArray: false,
        mergeAttrs: false,
        explicitChildren: false,
        explicitCharkey: true,
    }, function (err, result) {
        arraynge(result.definitions.types.schema).forEach(function (schema) {
            arraynge(schema.simpleType).forEach(function (simpleTypeNode) {
                output += treatSimpleTypeNode(simpleTypeNode);
            });
            arraynge(schema.complexType).forEach(function (complexTypeNode) {
                output += treatComplexTypeNode(complexTypeNode);
            });
            arraynge(schema.element).forEach(function (elementNode) {
                output += treatElementNode(elementNode);
            });
        });
    });
    return output;
}
/*
*********************
* SIMPLE TYPE NODES *
*********************

* Simple types are either enums or primitives
    * Example of a simple type as an enum:
        <simpleType name="DeployProblemType">
            <restriction base="string">
                <enumeration value="Warning"/>
                <enumeration value="Error"/>
                <enumeration value="Info"/>
            </restriction>
        </simpleType>

    * Examples of a simple type as a primitive, with and without additional restrictions, respectively:
        <simpleType name="ID">
            <restriction base="string">
                <length value="18"/>
                <pattern value="[a-zA-Z0-9]{18}"/>
            </restriction>
        </simpleType>
        <simpleType name="PlatformSchemaContentType">
            <restriction base="string"/>
        </simpleType>

* Note that restrictions like length and pattern are not taken into account while building the Typescript type.
*/
function treatSimpleTypeNode(simpleTypeNode) {
    var simpleNodeOutput = '';
    var typeName = capitalizeFirstLetter(simpleTypeNode.$.name) || '';
    var typePrimitive = simpleTypeNode.restriction.$.base || '';
    if (typePrimitive == 'string') {
        simpleNodeOutput += 'export type ' + typeName + ' = ';
        var enumerations = simpleTypeNode.restriction.enumeration;
        if (enumerations && enumerations.length > 0) {
            var enumerationValues = enumerations.map(function (enumeration) { return enumeration.$.value || ''; });
            simpleNodeOutput += '\'' + enumerationValues.join('\' \n      | \'') + '\'';
        }
        else { // Not an enumeration
            simpleNodeOutput += 'string';
        }
    }
    else {
        simpleNodeOutput += 'export type ' + typeName + ' = ' + translateTypeName(typePrimitive);
    }
    simpleNodeOutput += ';\n\n';
    return simpleNodeOutput;
}
/*
**********************
* COMPLEX TYPE NODES *
**********************

* Complex type nodes contain either a sequence block with a number of element nodes representing attributes or a complex content block.
    * Example of a complex type node with a sequence:
        <xsd:complexType name="CompileAndTestRequest">
            <xsd:sequence>
                <xsd:element name="checkOnly" type="xsd:boolean"/>
                <xsd:element name="classes" minOccurs="0" maxOccurs="unbounded" type="xsd:string"/>
                <xsd:element name="deleteClasses" minOccurs="0" maxOccurs="unbounded" type="xsd:string"/>
                <xsd:element name="deleteTriggers" minOccurs="0" maxOccurs="unbounded" type="xsd:string"/>
                <xsd:element name="runTestsRequest" minOccurs="0" type="tns:RunTestsRequest"/>
                <xsd:element name="triggers" minOccurs="0" maxOccurs="unbounded" type="xsd:string"/>
            </xsd:sequence>
        </xsd:complexType>

    * Example of a complex type node with a complex content:
        <xsd:complexType name="AIApplication">
            <xsd:complexContent>
                <xsd:extension base="tns:Metadata">
                    <xsd:sequence>
                        <xsd:element name="developerName" type="xsd:string"/>
                        <xsd:element name="masterLabel" minOccurs="0" type="xsd:string"/>
                        <xsd:element name="predictionDefinitions" minOccurs="0" maxOccurs="unbounded" type="tns:AIPredictionDefinition"/>
                        <xsd:element name="status" type="tns:AIApplicationStatus"/>
                        <xsd:element name="type" type="tns:AIApplicationType"/>
                    </xsd:sequence>
                </xsd:extension>
            </xsd:complexContent>
        </xsd:complexType>
*/
function treatComplexTypeNode(complexTypeNode) {
    var _a, _b;
    var complexNodeOutput = '';
    var typeName = capitalizeFirstLetter(((_a = complexTypeNode.$) === null || _a === void 0 ? void 0 : _a.name) || '');
    var sequenceNode;
    var typeStructure;
    if (complexTypeNode.complexContent) {
        typeStructure = 'complexContent';
    }
    else {
        typeStructure = 'sequence';
    }
    complexNodeOutput += 'export interface ' + typeName;
    switch (typeStructure) {
        case 'complexContent': {
            var updatedComplexTypeNode = complexTypeNode;
            var parentType = (_b = updatedComplexTypeNode.complexContent.extension.$.base) === null || _b === void 0 ? void 0 : _b.replace('tns_', '');
            complexNodeOutput += parentType ? ' extends ' + capitalizeFirstLetter(parentType) : '';
            sequenceNode = updatedComplexTypeNode.complexContent.extension.sequence;
            break;
        }
        case 'sequence': {
            var updatedComplexTypeNode = complexTypeNode;
            sequenceNode = updatedComplexTypeNode.sequence;
            break;
        }
    }
    complexNodeOutput += ' \{\n';
    if (sequenceNode && sequenceNode != '') {
        arraynge(sequenceNode.element).forEach(function (elementNode) {
            complexNodeOutput += treatAttribute(elementNode);
        });
    }
    complexNodeOutput += '\}\n\n';
    return complexNodeOutput;
}
function treatElementNode(elementNode) {
    var _a, _b;
    var elementNodeOutput = '';
    var typeName = capitalizeFirstLetter((_a = elementNode.$) === null || _a === void 0 ? void 0 : _a.name) || '';
    var sequenceNode = ((_b = elementNode.complexType) === null || _b === void 0 ? void 0 : _b.sequence) || '';
    elementNodeOutput += 'export interface ' + typeName;
    elementNodeOutput += ' \{\n';
    if (sequenceNode && sequenceNode != '') {
        arraynge(sequenceNode.element).forEach(function (subElementNode) {
            elementNodeOutput += treatAttribute(subElementNode);
        });
    }
    elementNodeOutput += '\}\n\n';
    return elementNodeOutput;
}
function treatAttribute(elementNode) {
    var _a;
    var attributeOutput = '';
    var fieldName = elementNode.$.name;
    var fieldTypeXml = elementNode.$.type;
    var minOccurs = elementNode.$.minOccurs;
    var maxOccurs = elementNode.$.maxOccurs;
    var nillable = elementNode.$.nillable;
    console.assert(fieldName != undefined, 'A field name is undefined');
    console.assert(fieldTypeXml != undefined, 'A field type is undefined');
    var optional = (minOccurs === '0' || nillable === 'true') ? '?' : '';
    attributeOutput += '    ' + fieldName + optional + ' : ';
    var fieldType = (_a = translateTypeName(fieldTypeXml !== null && fieldTypeXml !== void 0 ? fieldTypeXml : '')) !== null && _a !== void 0 ? _a : 'any';
    if (maxOccurs === 'unbounded') {
        attributeOutput += fieldType + ' | ' + fieldType + '[]';
    }
    else {
        attributeOutput += fieldType;
    }
    attributeOutput += ';\n';
    return attributeOutput;
}
function translateTypeName(fieldTypeXml) {
    var fieldType = '';
    switch (fieldTypeXml) {
        case 'boolean': {
            fieldType = 'boolean';
            break;
        }
        case 'string': {
            fieldType = 'string';
            break;
        }
        case 'dateTime': {
            fieldType = 'Date';
            break;
        }
        case 'int': {
            fieldType = 'number';
            break;
        }
        case 'base64Binary': {
            fieldType = 'string';
            break;
        }
        case 'double': {
            fieldType = 'number';
            break;
        }
        case 'date': {
            fieldType = 'Date';
            break;
        }
        case 'long': {
            fieldType = 'number';
            break;
        }
        case 'time': {
            fieldType = 'Date';
            break;
        }
        case 'anyType': {
            fieldType = 'any';
            break;
        }
        default: {
            if (fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.startsWith('tns_')) {
                fieldType = fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.replace('tns_', '');
            }
            else if (fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.startsWith('ens_')) {
                fieldType = fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.replace('ens_', '');
            }
            else if (fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.startsWith('mns_')) {
                fieldType = fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.replace('mns_', '');
            }
            else if (fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.startsWith('fns_')) {
                fieldType = fieldTypeXml === null || fieldTypeXml === void 0 ? void 0 : fieldTypeXml.replace('fns_', '');
            }
            else {
                fieldType = 'any';
            }
        }
    }
    return fieldType;
}
function capitalizeFirstLetter(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
function arraynge(input) {
    if (input === undefined) {
        return [];
    }
    else {
        return Array.isArray(input) ? input : [input];
    }
}
