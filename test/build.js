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

});
