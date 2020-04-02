import { UnitTest } from '@ephox/bedrock-client';
import { Gene, TestUniverse, Universe } from '@ephox/boss';
import { Arr, Option } from '@ephox/katamari';
import { oneAll } from 'ephox/robin/parent/Shared';
import { KAssert } from '@ephox/katamari-assertions';

UnitTest.test('SharedTest', function () {
  const data = TestUniverse(
    Gene('root', 'root', [
      Gene('1', 'div', [
        Gene('1.1', 'p', [Gene('1.1.1', 'text', [])]),
        Gene('1.2', 'ol', [
          Gene('1.2.1', 'li', [
            Gene('1.2.1.1', 'text', []),
            Gene('1.2.1.2', 'span', [Gene('1.2.1.2.1', 'text', [])]),
            Gene('1.2.1.3', 'text', [])
          ]),
          Gene('1.2.2', 'li', [Gene('1.2.2.1', 'text', [])])
        ]),
        Gene('1.3', 'p', [Gene('1.3.1', 'text', [])])
      ]),
      Gene('2', 'div', [Gene('2.1', 'blockquote', [Gene('2.1.1', 'text', [])])])
    ])
  );

  const checker = function (
    target: string,
    ids: string[],
    f: (look: (universe: Universe<Gene, undefined>, item: Gene) => Option<Gene>, items: Gene[]) => void
  ) {
    const items = Arr.map(ids, function (id) {
      return data.find(data.get(), id).getOrDie();
    });

    const look = function (universe: Universe<Gene, undefined>, item: Gene) {
      return item.name === target ? Option.some(item) : data.up().selector(item, target);
    };

    f(look, items);
  };

  const checkNone = function (target: string, ids: string[]) {
    checker(target, ids, function (look, items) {
      const actual = oneAll(data, look, items);
      KAssert.eqNone('eq', actual);
    });
  };

  const check = function (expected: string, target: string, ids: string[]) {
    checker(target, ids, function (look, items) {
      const actual = oneAll(data, look, items).map((x) => x.id);
      KAssert.eqSome('eq', expected, actual);
    });
  };

  checkNone('li', ['1.3.1']);
  checkNone('p', ['1.1.1', '1.3.1']);
  check('1.2', 'ol', ['1.2.2.1', '1.2.1.2']);
});
