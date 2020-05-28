/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import { HTMLElement } from '@ephox/dom-globals';
import { Arr, Cell, Option } from '@ephox/katamari';
import { Element, Elements } from '@ephox/sugar';
import Editor from 'tinymce/core/api/Editor';
import { insertTableWithDataValidation } from '../actions/InsertTable';
import { ResizeHandler } from '../actions/ResizeHandler';
import { SelectionTargets } from '../selection/SelectionTargets';

const getClipboardElements = (clipboardElems: Cell<Option<Element[]>>): HTMLElement[] => clipboardElems.get().fold(
  () => [],
  (elems) => Arr.map(elems, (e) => e.dom())
);

const setClipboardElements = (elems: HTMLElement[], clipboardElems: Cell<Option<Element[]>>) => {
  const elmsOpt = elems.length > 0 ? Option.some(Elements.fromDom(elems)) : Option.none<Element[]>();
  clipboardElems.set(elmsOpt);
};

const getApi = (editor: Editor, clipboardRows: Cell<Option<Element[]>>, clipboardCols: Cell<Option<Element[]>>, resizeHandler: ResizeHandler, selectionTargets: SelectionTargets) => ({
  insertTable: (columns: number, rows: number, options: Record<string, number> = {}) =>
    insertTableWithDataValidation(editor, rows, columns, options, 'Invalid values for insertTable - rows and columns values are required to insert a table.'),
  setClipboardRows: (rows: HTMLElement[]) => setClipboardElements(rows, clipboardRows),
  getClipboardRows: () => getClipboardElements(clipboardRows),
  setClipboardCols: (cols: HTMLElement[]) => setClipboardElements(cols, clipboardCols),
  getClipboardCols: () => getClipboardElements(clipboardCols),
  resizeHandler,
  selectionTargets
});

export { getApi };

