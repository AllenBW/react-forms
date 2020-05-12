import React from 'react';
import PropTypes from 'prop-types';
import ComponentExample from '@docs/components/component-example';
import { Heading } from './mdx/mdx-components';

const ComponentExampleText = ({ component, activeMapper, baseStructure }) => {
  return (
    <React.Fragment>
      <Heading level="4" component="h1">
        {baseStructure.linkText}
      </Heading>
      <ComponentExample activeMapper={activeMapper} baseStructure={baseStructure} component={component} />
      <div hidden={activeMapper !== 'mui'} className="mui">
        <Heading level="5" component="h2">{`MUI ${baseStructure.linkText}`}</Heading>
        <baseStructure.ContentText activeMapper={activeMapper} component={component} />
      </div>
      <div hidden={activeMapper !== 'pf3'}>
        <Heading level="5" component="h2">{`PF3 ${baseStructure.linkText}`}</Heading>
        <baseStructure.ContentText activeMapper={'pf3'} component={component} />
      </div>
      <div hidden={activeMapper !== 'pf4'}>
        <Heading level="5" component="h2">{`PF4 ${baseStructure.linkText}`}</Heading>
        <baseStructure.ContentText activeMapper={'pf4'} component={component} />
      </div>
      <div hidden={activeMapper !== 'blueprint'}>
        <Heading level="5" component="h2">{`Blueprint ${baseStructure.linkText}`}</Heading>
        <baseStructure.ContentText activeMapper={'blueprint'} component={component} />
      </div>
    </React.Fragment>
  );
};

ComponentExampleText.propTypes = {
  component: PropTypes.string.isRequired,
  activeMapper: PropTypes.oneOf(['mui', 'pf4', 'pf3']),
  baseStructure: PropTypes.shape({ linkText: PropTypes.string.isRequired }).isRequired
};

export default ComponentExampleText;
