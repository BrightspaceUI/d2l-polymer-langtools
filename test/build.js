const 
    assert = require('assert'),
    { buildLang } = require('../src/build');

describe('buildLang()', () => {

    it('proper PascalCase conversion of langName', () => {
        const src = 'This should be unchanged {{langPascal}}';
        const langName = 'en-us';
        const expected = 'This should be unchanged EnUs';

        const built = buildLang(langName, '', src);

        assert.equal(built, expected);
    });

    it('proper camelCase conversion of langName', () => {
        const src = 'This should be unchanged {{langCamel}}';
        const langName = 'en-us';
        const expected = 'This should be unchanged enUs';

        const built = buildLang(langName, '', src);

        assert.equal(built, expected);
    });

    it('proper insertion of langData', () => {
        const src = 'This should be unchanged {{langData}}\nAlso unchanged';
        const langData = {
            test: "test1"
        };
        const expected = `This should be unchanged {"test":"test1"}\nAlso unchanged`;

        const built = buildLang('', langData, src);

        assert.equal(built, expected);
    });

    it('proper langData expansion, conversion to single quotes', () => {
        const src = 'This should be unchanged\n{{langData}}\nAlso unchanged';
        const langData = {
            test: "test1",
            escapedQuotes: "This can \"have whatever qu\"otes inside\""
        };
        const expected = `This should be unchanged\n{\n    'test': 'test1',\n    'escapedQuotes': 'This can "have whatever qu"otes inside"'\n}\nAlso unchanged`;

        const built = buildLang('', langData, src, true);

        assert.equal(built, expected);
    });

    it('proper JSON spacing, matches configuration', () => {
        const src = 'This should be unchanged\n{{langData}}\nAlso unchanged';
        const langData = {
            test: "test1",
            escapedQuotes: "This can \"have whatever qu\"otes inside\"",
            complex: {
                nested: 'structure'
            }
        };
        
        const expectedDefault = `This should be unchanged\n{\n    'test': 'test1',\n    'escapedQuotes': 'This can "have whatever qu"otes inside"',\n    'complex': {\n        'nested': 'structure'\n    }\n}\nAlso unchanged`;
        const expectedNumeric = `This should be unchanged\n{\n  'test': 'test1',\n  'escapedQuotes': 'This can "have whatever qu"otes inside"',\n  'complex': {\n    'nested': 'structure'\n  }\n}\nAlso unchanged`;
        const expectedString = `This should be unchanged\n{\n\t'test': 'test1',\n\t'escapedQuotes': 'This can "have whatever qu"otes inside"',\n\t'complex': {\n\t\t'nested': 'structure'\n\t}\n}\nAlso unchanged`;

        assert.equal(buildLang('', langData, src, true), expectedDefault);
        assert.equal(buildLang('', langData, src, true, 2), expectedNumeric);
        assert.equal(buildLang('', langData, src, true, '\t'), expectedString);
    });

});
