# Typeforce: TypeScript type generator for Salesforce

## How to generate types

1. Update the WSDL files to the latest version by running `bun run reload-wsdl`.
1. Run the type generation script with `bun run start`.
1. The resulting definition files will be in the `./output` folder.

## How to use types

```typescript
// Use xml2js as the XML parsing engine
import * as xml2js from 'xml2js';

// Import the type definitions that you will need
import { PermissionSet } from './output/metadata';

// This is a minimal example
const xml : string = 
'<?xml version="1.0" encoding="UTF-8"?> \
<PermissionSet xmlns="http://soap.sforce.com/2006/04/metadata"> \
    <description>This is a simplistic example.</description> \
    <fieldPermissions> \
        <editable>false</editable> \
        <field>Account.Industry</field> \
        <readable>true</readable> \
    </fieldPermissions> \
    <hasActivationRequired>false</hasActivationRequired> \
    <label>Account.Industry - Read</label> \
</PermissionSet>';

xml2js.parseString(xml,
    // NOTE: These options for the parser guarantee a proper casting.
    { 
        explicitArray: false, 
        mergeAttrs: true, 
        valueProcessors: [
            xml2js.processors.parseNumbers, 
            xml2js.processors.parseBooleans,
        ],
    },
    function (err, result) {
        if (err) {
            console.dir(err);
        } else {
            let permissionSet : PermissionSet = result.PermissionSet;

            console.dir(permissionSet);
            /* OUTPUT
            {
                xmlns: 'http://soap.sforce.com/2006/04/metadata',
                description: 'This is a simplistic example.',
                fieldPermissions: { 
                    editable: false, 
                    field: 'Account.Industry', 
                    readable: true 
                },
                hasActivationRequired: false,
                label: 'Account.Industry - Read'
            }
            */
            array(permissionSet.fieldPermissions).forEach(
                (fieldPermission) => {
                    console.dir(
                        'Field ' 
                        + fieldPermission.field 
                        + ' is ' 
                        + (fieldPermission.editable ? 'editable' : 'not editable') 
                        + ' and ' 
                        + (fieldPermission.readable ? 'readable' : 'not readable')
                    );
                }
            );
            /* OUTPUT
            'Field Account.Industry is not editable and readable'
            */
        }
    }
);
```

where the function `array()` is

``` typescript
function array<Type>(input: Type | Type[] | undefined): Type[] {
    if (input === undefined) {
        return [];
    } else {
        return Array.isArray(input) ? input : [input];
    }
}
```
