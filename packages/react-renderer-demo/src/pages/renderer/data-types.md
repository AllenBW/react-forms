import Grid from '@material-ui/core/Grid'
import CodeExample from '@docs/code-example';

import ListOfContents from '@docs/list-of-contents';

<Grid container item>
<Grid item xs={12} md={10}>

# Introduction

 You can specify a type of a component by providing `dataType`, which will automatically validates the component value.
Because almost everything in HTML inputs is outputed as a string, adding the `dataType` props will also cast the value to given type.

## Available dataTypes

 ```jsx
['integer', 'float', 'number', 'boolean', 'string']
```
<CodeExample source="components/data-types-example" mode="preview" />

</Grid>
<Grid item xs={false} md={2}>
  <ListOfContents file="renderer/data-types" />
</Grid>
</Grid>
