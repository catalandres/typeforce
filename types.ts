export interface Properties {
    [key: string]: string;
}

export interface Node {
    $?: Properties;
}

export interface NodeWithAttributes extends Node {
    $: Properties;
}    

export interface SequenceNode extends NodeWithAttributes {
    element: NodeWithAttributes[] | NodeWithAttributes;
}    

export interface ExtensionNode extends NodeWithAttributes {
    sequence: SequenceNode;
}    

export interface ComplexContentNode extends Node {
    extension: ExtensionNode;
}    

export interface ComplexTypeNode extends Node {}

export interface ComplexTypeNodeWithSequence extends ComplexTypeNode {
    sequence? : SequenceNode;
}

export interface ComplexTypeNodeWithComplexContent extends ComplexTypeNode {
    complexContent : ComplexContentNode;
}        

export interface RestrictionNode extends NodeWithAttributes {
    enumeration: NodeWithAttributes[] | NodeWithAttributes;
}

export interface SimpleTypeNode extends NodeWithAttributes {
    restriction : RestrictionNode;
}        

export interface ElementNode extends NodeWithAttributes {
    complexType : ComplexTypeNodeWithSequence;
}        

export interface SchemaNode extends NodeWithAttributes {
    complexType : ComplexTypeNode[] | ComplexTypeNode;
    simpleType : SimpleTypeNode[] | SimpleTypeNode;
    element : ElementNode[] | ElementNode;
}            

export interface TypesNode extends Node {
    schema: SchemaNode | SchemaNode[];
}                

export interface DefinitionsNode extends NodeWithAttributes {
    types: TypesNode;
    message: any;
    portType: any;
    binding: any;
    service: any;
}                    

