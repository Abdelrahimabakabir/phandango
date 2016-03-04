/* colours are used by shape constructors as
 * well as line graphs reducers, block reducers
 * http://html-color-codes.info/color-names/
 */
export const colourDB = {
  block: {
    gubbinsLeaf: 'blue',
    gubbinsNode: 'red',
    gubbinsPerTaxa: 'DodgerBlue',
    bratNextGen: {
      default: 'DarkOrange',
    },
    merge: 'LimeGreen',
    roary: 'MediumBlue',
    unknown: 'Black', // how does this happen?
  },
  line: {
    // subline: '#bbbbbb', // currently hard-coded in lineGraph.jsx
    gubbins: 'Black',
    gubbinsPerTaxa: 'DodgerBlue',
    bratNextGen: 'DarkOrange',
    roary: 'MediumBlue',
  },
  artemis: {
    0: 'white',
    1: '#707070',
    2: '#C80000',
    3: '#2C802D',
    4: '#2A2C92',
    5: '#22A5A3',
    6: '#A61785',
    7: '#E9E930',
    8: '#19CE2E',
    9: '#19ACCE',
    10: '#ED961D',
    11: '#6B4E25',
    12: '#DB66D1',
    13: '#AFADAF',
  },
};

export function Arrow(featurestart, featureend, direction, fill, stroke, strokeWidth, info) {
  // This is a very simple and unsafe constructor.
  // All we're doing is checking if the values exist.
  // 'x || 0' just means 'if there is a value for x, use that. Otherwise use 0.'
  this.direction = direction || 'None';
  this.fill = fill || '#AAAAAA';
  this.stroke = stroke || 'black';
  this.strokeWidth = strokeWidth || 1;
  this.info = info || '';
  this.featurestart = featurestart || 0;
  this.featureend = featureend || 0;
  this.x = 0;
  this.y = 0;
  this.w = 1;
  this.h = 20;
  this.coordinates = [];
  this.ID = '';
  this.product = '';
  this.fields = {};

  const infoparts = this.info.split(';');
  // console.log(infoparts);
  for (let i = 0; i < infoparts.length; i++) {
    const varval = infoparts[i].split('=');
    if (varval.length < 2) {
      continue;
    }
    const variable = varval[0].replace(/(^'|'$)/g, '').replace(/(^"|"$)/g, '');
    const value = varval[1].replace(/(^'|'$)/g, '').replace(/(^"|"$)/g, '').substring(0, 50);

    if (variable && value) {
      this.fields[variable] = value;
    }

    // if (variable === 'ID') {
    //   this.ID = value;
    // } else if (variable === 'product') {
    //   this.product = value.replace(/(^'|'$)/g, '');
    // } else if (variable === 'locus_tag') {
    //   this.locus_tag = value.replace(/(^'|'$)/g, '');
    // }
    if ((variable === 'color') || (variable === 'colour')) {
      const colourValue = +value.replace(/(^'|'$)/g, '');

      if (!isNaN(colourValue)) {
        if (colourValue < 14 && colourValue > -1) {
          this.fill = colourDB.artemis[colourValue];
          // console.log(this.ID, this.product, this.fill, colour_value);
        }
      }
    }
  }
}

/* Block constructor
 * there are only three essential fields here - startBase, endBase and id (unique integer)
 * if you don't use any optional arguments you must pass {}
 * optional arguments:
 * taxa - saved to this.taxa
 * colour - saved to fill
 * node - saved but not used in display yet
 * (if node is false then it's a leaf (croucher's version would display blue))
 * info {obj} - a map of names and values to be displayed, e.g. nll, snps
 * summary:
 * // new Block(start, end, id, {colour, taxa, node, info})
 */
export function Block(startBase, endBase, id, {
  colour = undefined,
  taxa = undefined,
  node = false,
  info = {},
}) {
  this.startBase = startBase;
  this.endBase = endBase;
  this.id = id; // unique
  this.taxa = taxa;
  this.info = info;
  this.node = node;
  if (colour) {
    this.fill = colour;
  } else {
    this.fill = colourDB.block.unknown;
  }
  // the following are used by the display, added here for speed (?)
  this.x1 = 0;
  this.x2 = 0;
  this.y1 = 0;
  this.y2 = 0;
}

/* Ellipse */
export function Ellipse(featurex, featurey, val1, radiusX = false) {
  this.stroke = 'black';
  this.strokeWidth = 1;
  this.featurex = featurex;
  this.featurey = featurey;
  this.radiusX = radiusX;
  this.rSquared = val1;
  // R^2 -> colour (unless seer)
  if (this.radiusX) {
    this.fill = 'gray';
  } else {
    if (val1 > 0.8) {
      this.fill = '#FF0000';
    } else if (val1 > 0.6) {
      this.fill = '#FFA500';
    } else if (val1 > 0.4) {
      this.fill = '#32CD32';
    } else if (val1 > 0.2) {
      this.fill = '#87CEFA';
    } else if (val1 >= 0) {
      this.fill = '#0000FF';
    }
  }
}
