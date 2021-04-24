import { jsonObjectDiff } from './object-diff';

describe('ObjectDiff', () => {

  it('empty object equals', () => {
    const lhs = {};
    const rhs = {};

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {};

    expect(diff).toEqual(expectedResult);
  });

  it('empty arrays equals', () => {
    const lhs = [];
    const rhs = [];

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {};

    expect(diff).toEqual(expectedResult);
  })

  it('simple object equals', () => {
    const lhs = { first: 'value' };
    const rhs = { first: 'value' };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {};

    expect(diff).toEqual(expectedResult);
  });

  it('complex object equals', () => {
    const lhs = { first: 'value', second: { third: 'anotherValue' } };
    const rhs = { first: 'value', second: { third: 'anotherValue' } };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {};

    expect(diff).toEqual(expectedResult);
  });

  it('new missing value', () => {
    const lhs = { second: { third: 'anotherValue' } };
    const rhs = { first: 'value', second: { third: 'anotherValue' } };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {
      first: 'value -> '
    };

    expect(diff).toEqual(expectedResult);
  });

  it('original missing value', () => {
    const lhs = { first: 'value', second: { third: 'anotherValue' } };
    const rhs = { second: { third: 'anotherValue' } };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {
      first: ' -> value'
    };

    expect(diff).toEqual(expectedResult);
  });

  it('different value exists', () => {
    const lhs = { first: 'value', second: { third: 'anotherValue' } };
    const rhs = { first: 'different', second: { third: 'anotherValue' } };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {
      first: 'different -> value'
    };

    expect(diff).toEqual(expectedResult);
  });

  it('different deep value exists', () => {
    const lhs = { first: 'value', second: { third: 'anotherValue' } };
    const rhs = { first: 'value', second: { third: 'differentValue' } };

    const diff = jsonObjectDiff(lhs, rhs);
    const expectedResult = {
      second: {
        third: 'differentValue -> anotherValue'
      }
    };

    expect(diff).toEqual(expectedResult);
  });

});
