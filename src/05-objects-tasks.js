/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

// my class selector
class MySelector {
  constructor(selector) {
    this.noDuplicateTypes = ['element', 'id', 'pseudo-element'];
    this.result = [selector];
  }

  element(value) {
    this.check('element');
    this.result.push({ type: 'element', value });
    return this;
  }

  id(value) {
    this.check('id');
    this.result.push({ type: 'id', value });
    return this;
  }

  class(value) {
    this.check('class');
    this.result.push({ type: 'class', value });
    return this;
  }

  attr(value) {
    this.check('attr');
    this.result.push({ type: 'attr', value });
    return this;
  }

  pseudoClass(value) {
    this.check('pseudo-class');
    this.result.push({ type: 'pseudo-class', value });
    return this;
  }

  pseudoElement(value) {
    this.check('pseudo-element');
    this.result.push({ type: 'pseudo-element', value });
    return this;
  }

  stringify() {
    return this.result.reduce((res, el) => {
      if (el.type === 'element') return res + el.value;
      if (el.type === 'pseudo-element') return `${res}::${el.value}`;
      if (el.type === 'id') return `${res}#${el.value}`;
      if (el.type === 'class') return `${res}.${el.value}`;
      if (el.type === 'pseudo-class') return `${res}:${el.value}`;
      if (el.type === 'attr') return `${res}[${el.value}]`;
      return res;
    }, '');
  }

  check(type) {
    if (this.noDuplicateTypes.includes(type)) {
      if (this.result.filter((el) => el.type === type).length) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
    }
    const paragon = ['element', 'id', 'class', 'attr', 'pseudo-class', 'pseudo-element'];
    const index = paragon.indexOf(this.result[this.result.length - 1].type);
    if (paragon.indexOf(type) < index) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
  }
}

// builder itself
const cssSelectorBuilder = {
  element(value) {
    return new MySelector({ type: 'element', value });
  },
  pseudoElement(value) {
    return new MySelector({ type: 'pseudo-element', value });
  },
  id(value) {
    return new MySelector({ type: 'id', value });
  },
  class(value) {
    return new MySelector({ type: 'class', value });
  },
  pseudoClass(value) {
    return new MySelector({ type: 'pseudo-class', value });
  },

  attr(value) {
    return new MySelector({ type: 'attr', value });
  },

  combine(sel1, separator, sel2) {
    return {
      sel1,
      sel2,
      separator,
      stringify() {
        return `${this.sel1.stringify()} ${this.separator} ${this.sel2.stringify()}`;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
