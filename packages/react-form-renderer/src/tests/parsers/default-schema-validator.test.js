import output from '../../demo-schemas/miq-schemas/output';
import React from 'react';
import defaultSchemaValidator from '../../parsers/default-schema-validator';
import { components } from '../../constants/';

describe('Default schema validator', () => {
  let formFieldsMapper;
  beforeEach(() => {
    formFieldsMapper = {
      foo: props => <div>Component</div>,
      invalidComponent: 'baz',
      [components.TABS]: ({ children }) => <div>{ children }</div>,
    };
  });
  it('should fail if input is not a object', () => {
    expect(() => defaultSchemaValidator([])).toThrowErrorMatchingSnapshot();
  });

  it('should fail if input object does not have fields names', () => {
    expect(() => defaultSchemaValidator({})).toThrowErrorMatchingSnapshot();
  });

  it('should fail if input object does fields names that is not array', () => {
    expect(() => defaultSchemaValidator({ fields: {}})).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field item does not have component property', () => {
    expect(() => defaultSchemaValidator({ fields: [{}]})).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field item does not have name property', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field item does not have name property but have key', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo', key: 'some key',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field component property is not in form fields mapper.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'blarghs',
      name: 'foo',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it.skip('should fail if field component from form fields mapper is not a valid React component.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'invalidComponent',
      name: 'foo',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field condition is not correct type.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: '',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field condition is missing when key.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: {},
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field condition is missing is key.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 'Foo' },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field condition when property is not correct type.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 123, is: 456 },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field condition pattern property is not correct type.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 'Foo', pattern: 456 },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should not fail if field condition pattern property is a string', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 'Foo', pattern: '^pattern' },
    }]}, formFieldsMapper)).not.toThrow();
  });

  it('should fail if field condition have notMatch property and have not is/pattern.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: { when: 'Foo', isEmpty: true, notMatch: true },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field validate is not an array.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: {},
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should not fail if validate is undefined.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: undefined,
    }]}, formFieldsMapper)).not.toThrow();
  });

  it('should not fail if field validate item is a function.', () => {
    const functionValidator = (value) => 'cosi';
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [
        functionValidator,
      ],
    }]}, formFieldsMapper)).not.toThrow();
  });

  it('should fail if field validate item is not an object or a function.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [ '' ],
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field validate item is an object and does not have type property.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [{}],
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail if field validate item is an object and validator type does not exist.', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      validate: [{
        type: 'magic',
      }],
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should fail validation when using wrong data type', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      dataType: 'foo',
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      dataType: {},
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });

  it('should pass validation', () => {
    expect(() => defaultSchemaValidator(output, {
      ...formFieldsMapper, 'sub-form': () => <div />,
      'text-field': () => <div />,
      'textarea-field': () => <div />,
      checkbox: () => <div />,
      radio: () => <div />,
      'select-field': () => <div />,
      'date-picker': () => <div />,
      'time-picker': () => <div />,
    })).not.toThrow();
  });

  it('should not fail validation using "and" and "or" conditions', () => {
    expect(() =>
      defaultSchemaValidator(
        {
          fields: [
            {
              component: 'foo',
              name: 'foo',
              condition: {
                and: [{ when: 'x', is: 'y' }],
              },
            },
          ],
        },
        formFieldsMapper,
      )
    ).not.toThrow();

    expect(() =>
      defaultSchemaValidator(
        {
          fields: [
            {
              component: 'foo',
              name: 'foo',
              condition: {
                or: [{ when: 'x', is: 'y' }],
              },
            },
          ],
        },
        formFieldsMapper,
      )
    ).not.toThrow();
  });

  it('should fail validation when using "and" and "or" conditions', () => {
    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: {
        and: { when: 'x', is: 'y' },
      },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();

    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: {
        or: { when: 'x', is: 'y' },
      },
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();

    expect(() => defaultSchemaValidator({ fields: [{
      component: 'foo',
      name: 'foo',
      condition: [{
        and: { when: 'x', is: 'y' },
      }, { when: 'foo', is: 'bar' }],
    }]}, formFieldsMapper)).toThrowErrorMatchingSnapshot();
  });
});
