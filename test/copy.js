const 
    assert = require('assert'),
    { copyLang } = require('../src/copy');

let sampleSet;

describe('copyLang()', () => {

    beforeEach(() => {
        sampleSet = {
            a: 'A',
            b: 'B'
        };
    });

    it('matching source/dest is noop', () => {
        const output = copyLang(sampleSet, sampleSet);
        assert.deepEqual(output, sampleSet);
    });

    it('empty source clears', () => {
        const output = copyLang({}, sampleSet);
        assert.deepEqual(output, {});
    });

    it('empty dest becomes source', () => {
        const output = copyLang(sampleSet, {});
        assert.deepEqual(output, sampleSet);
    });

    it('only new terms are copied', () => {
        const src = Object.assign({ c: 'C' }, sampleSet);
        const dest = Object.assign({}, sampleSet);
        dest.a = '!!';

        assert.notEqual(src.a, dest.a);

        const output = copyLang(src, dest);
        assert.equal(output.a, dest.a);
        assert.equal(output.c, src.c);
    });

    it('excluded terms are deleted', () => {
        const src = Object.assign({}, sampleSet);
        const dest = Object.assign({ c: 'C' }, sampleSet);

        assert.equal(src.c, undefined);
        assert.notEqual(dest.c, undefined);

        const output = copyLang(src, dest);
        assert.equal(output.c, undefined);
    });

    it('modifications can be overridden', () => {
        const src = Object.assign({ c: 'C' }, sampleSet);
        const dest = Object.assign({ c: '!!' }, sampleSet);

        assert.notEqual(src.c, dest.c);

        const output = copyLang(src, dest, [ 'c' ]);
        assert.deepEqual(output, src);
    });

});
