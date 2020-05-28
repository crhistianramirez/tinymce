import { Arr } from '@ephox/katamari';
import { Compare, Element, InsertAll, Replication } from '@ephox/sugar';
import * as TagLookup from '../lookup/TagLookup';
import * as DetailsList from '../model/DetailsList';
import { onCells, TargetSelection } from '../model/RunOperation';
import * as Transitions from '../model/Transitions';
import { Warehouse } from '../model/Warehouse';
import { Generators } from './Generators';
import { DetailExt, ElementNew, RowCells } from './Structs';

const getCellsToCopy = (row: RowCells, selectedCells: DetailExt[]) => {
  const cellsToCopy = row.cells().slice(selectedCells[0].column(), selectedCells[selectedCells.length - 1].column() + selectedCells[selectedCells.length -1 ].colspan());
  // Exclude duplicate cells due to colspans
  return Arr.foldl(cellsToCopy, (acc, cell) => {
    const hasCell = Arr.exists(acc, (c) => Compare.eq(cell.element(), c.element()));
    return hasCell ? acc : acc.concat([ cell ]);
  }, [] as ElementNew[]);
};

const copyCols = function (table: Element, target: TargetSelection, generators: Generators) {
  const list = DetailsList.fromTable(table);
  const house = Warehouse.generate(list);
  const details = onCells(house, target);
  return details.map((selectedCells) => {
    const grid = Transitions.toGrid(house, generators, false);
    return Arr.map(grid, (row, idx) => {
      const cellsToCopy = getCellsToCopy(row, selectedCells);
      const copiedCells = Arr.bind(cellsToCopy, (cell) => {
        // Exclude duplicate cells due to rowspans
        const address = TagLookup.detect(cell.element());
        const rowIndex = address.map((a) => a.row()).getOr(idx);
        return rowIndex === idx ? [ Replication.deep(cell.element()) ] : [ ];
      });
      const fakeTR = Element.fromTag('tr');
      InsertAll.append(fakeTR, copiedCells);
      return fakeTR;
    });
  });
};

export {
  copyCols
};
