(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.au.ac === region.aB.ac)
	{
		return 'on line ' + region.au.ac;
	}
	return 'on lines ' + region.au.ac + ' through ' + region.aB.ac;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bv,
		impl.bt,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		P: func(record.P),
		av: record.av,
		aq: record.aq
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.P;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.av;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aq) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bv,
		impl.bt,
		function(sendToApp, initialModel) {
			var view = impl.bw;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bj,
		impl.bv,
		impl.bt,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.at && impl.at(sendToApp)
			var view = impl.bw;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bb);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bu) && (_VirtualDom_doc.title = title = doc.bu);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bn;
	var onUrlRequest = impl.bo;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		at: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aV === next.aV
							&& curr.aJ === next.aJ
							&& curr.aR.a === next.aR.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bj: function(flags)
		{
			return A3(impl.bj, flags, _Browser_getUrl(), key);
		},
		bw: impl.bw,
		bv: impl.bv,
		bt: impl.bt
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { bh: 'hidden', bc: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { bh: 'mozHidden', bc: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { bh: 'msHidden', bc: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { bh: 'webkitHidden', bc: 'webkitvisibilitychange' }
		: { bh: 'hidden', bc: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		a_: _Browser_getScene(),
		a5: {
			a7: _Browser_window.pageXOffset,
			a8: _Browser_window.pageYOffset,
			a6: _Browser_doc.documentElement.clientWidth,
			aH: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		a6: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		aH: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			a_: {
				a6: node.scrollWidth,
				aH: node.scrollHeight
			},
			a5: {
				a7: node.scrollLeft,
				a8: node.scrollTop,
				a6: node.clientWidth,
				aH: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			a_: _Browser_getScene(),
			a5: {
				a7: x,
				a8: y,
				a6: _Browser_doc.documentElement.clientWidth,
				aH: _Browser_doc.documentElement.clientHeight
			},
			bf: {
				a7: x + rect.left,
				a8: y + rect.top,
				a6: rect.width,
				aH: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.w) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.d);
		} else {
			var treeLen = builder.w * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.x) : builder.x;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.w);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.d);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{x: nodeList, w: (len / $elm$core$Array$branchFactor) | 0, d: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aG: fragment, aJ: host, aP: path, aR: port_, aV: protocol, aW: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Main$New = {$: 0};
var $author$project$Main$None = {$: 2};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{v: $author$project$Main$None, l: $author$project$Main$New},
		$elm$core$Platform$Cmd$none);
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$Formula = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$Proven = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$Proving = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$Shape = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$FOp = function (a) {
	return {$: 2, a: a};
};
var $author$project$Generalise$LOp = function (a) {
	return {$: 4, a: a};
};
var $author$project$Generalise$ROp = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$SOp = function (a) {
	return {$: 0, a: a};
};
var $author$project$Generalise$TOp = function (a) {
	return {$: 3, a: a};
};
var $author$project$ShowProof$countSteps = function (pt) {
	_v0$14:
	while (true) {
		switch (pt.$) {
			case 0:
				switch (pt.a.$) {
					case 0:
						var _v1 = pt.a;
						var l = _v1.a;
						var s = _v1.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$LOp(l))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s));
					case 4:
						var _v2 = pt.a;
						var t1 = _v2.a;
						var t2 = _v2.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t1))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t2));
					case 2:
						var _v3 = pt.a;
						var f = _v3.a;
						var s = _v3.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$FOp(f))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s));
					case 1:
						var _v4 = pt.a;
						var f = _v4.a;
						var s = _v4.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$FOp(f))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s));
					case 3:
						var _v5 = pt.a;
						var s1 = _v5.a;
						var s2 = _v5.b;
						var s3 = _v5.c;
						var s4 = _v5.d;
						return (((1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s1))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s2))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s3))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s4));
					default:
						break _v0$14;
				}
			case 1:
				switch (pt.a.$) {
					case 1:
						var _v6 = pt.a;
						var t1 = _v6.a;
						var t2 = _v6.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t1))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t2));
					case 0:
						var _v7 = pt.a;
						var s = _v7.a;
						var r = _v7.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$ROp(r));
					case 2:
						var s = pt.a.a;
						return 1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s));
					case 3:
						var r = pt.a.a;
						return 1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$ROp(r));
					default:
						break _v0$14;
				}
			case 3:
				switch (pt.a.$) {
					case 0:
						var _v8 = pt.a;
						var t1 = _v8.a;
						var s = _v8.b;
						var t2 = _v8.c;
						return ((1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t1))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$SOp(s))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t2));
					case 1:
						var _v9 = pt.a;
						var l = _v9.a;
						var t = _v9.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$LOp(l))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t));
					case 2:
						var _v10 = pt.a;
						var r = _v10.a;
						var t = _v10.b;
						return (1 + $author$project$ShowProof$countSteps(
							$author$project$Generalise$ROp(r))) + $author$project$ShowProof$countSteps(
							$author$project$Generalise$TOp(t));
					default:
						break _v0$14;
				}
			case 2:
				if (!pt.a.$) {
					var _v11 = pt.a;
					var r1 = _v11.a;
					var r2 = _v11.b;
					var r3 = _v11.c;
					var r4 = _v11.d;
					return (((1 + $author$project$ShowProof$countSteps(
						$author$project$Generalise$ROp(r1))) + $author$project$ShowProof$countSteps(
						$author$project$Generalise$ROp(r2))) + $author$project$ShowProof$countSteps(
						$author$project$Generalise$ROp(r3))) + $author$project$ShowProof$countSteps(
						$author$project$Generalise$ROp(r4));
				} else {
					break _v0$14;
				}
			default:
				if (!pt.a.$) {
					var _v12 = pt.a;
					var r = _v12.a;
					var l = _v12.b;
					return (1 + $author$project$ShowProof$countSteps(
						$author$project$Generalise$ROp(r))) + $author$project$ShowProof$countSteps(
						$author$project$Generalise$LOp(l));
				} else {
					break _v0$14;
				}
		}
	}
	return 0;
};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Generalise$L = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$Rect = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Generalise$Square = function (a) {
	return {$: 5, a: a};
};
var $author$project$Generalise$Tri = function (a) {
	return {$: 3, a: a};
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$Basics$round = _Basics_round;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Equation$evalFib = function (n) {
	return $elm$core$Basics$round(
		A2(
			$elm$core$Basics$pow,
			(1.0 + $elm$core$Basics$sqrt(5)) / 2,
			n) / $elm$core$Basics$sqrt(5));
};
var $author$project$Equation$evalTri = function (n) {
	return ((n * (n + 1)) / 2) | 0;
};
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Equation$eval = F2(
	function (ctx, exp) {
		switch (exp.$) {
			case 0:
				var e1 = exp.a;
				var e2 = exp.b;
				return A3(
					$elm$core$Maybe$map2,
					$elm$core$Basics$add,
					A2($author$project$Equation$eval, ctx, e1),
					A2($author$project$Equation$eval, ctx, e2));
			case 1:
				var e1 = exp.a;
				var e2 = exp.b;
				return A3(
					$elm$core$Maybe$map2,
					$elm$core$Basics$mul,
					A2($author$project$Equation$eval, ctx, e1),
					A2($author$project$Equation$eval, ctx, e2));
			case 2:
				var e1 = exp.a;
				var e2 = exp.b;
				return A3(
					$elm$core$Maybe$map2,
					$elm$core$Basics$sub,
					A2($author$project$Equation$eval, ctx, e1),
					A2($author$project$Equation$eval, ctx, e2));
			case 3:
				var e1 = exp.a;
				var e2 = exp.b;
				return A3(
					$elm$core$Maybe$map2,
					$elm$core$Basics$idiv,
					A2($author$project$Equation$eval, ctx, e1),
					A2($author$project$Equation$eval, ctx, e2));
			case 4:
				var e1 = exp.a;
				var e2 = exp.b;
				return A3(
					$elm$core$Maybe$map2,
					$elm$core$Basics$pow,
					A2($author$project$Equation$eval, ctx, e1),
					A2($author$project$Equation$eval, ctx, e2));
			case 5:
				var n = exp.a;
				return A2($elm$core$Dict$get, n, ctx);
			case 6:
				var i = exp.a;
				return $elm$core$Maybe$Just(i);
			case 7:
				var _var = exp.a.a4;
				var start = exp.a.au;
				var end = exp.a.aB;
				var expr = exp.a.aE;
				var next = F2(
					function (val, tot) {
						var n = _var;
						return A3(
							$elm$core$Maybe$map2,
							$elm$core$Basics$add,
							tot,
							A2(
								$author$project$Equation$eval,
								A3($elm$core$Dict$insert, n, val, ctx),
								expr));
					});
				var _v1 = _Utils_Tuple2(
					A2($author$project$Equation$eval, ctx, start),
					A2($author$project$Equation$eval, ctx, end));
				if ((!_v1.a.$) && (!_v1.b.$)) {
					var startV = _v1.a.a;
					var endV = _v1.b.a;
					return A3(
						$elm$core$List$foldl,
						next,
						$elm$core$Maybe$Just(0),
						A2($elm$core$List$range, startV, endV));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			case 8:
				var e = exp.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Equation$evalFib,
					A2($author$project$Equation$eval, ctx, e));
			default:
				var e = exp.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Equation$evalTri,
					A2($author$project$Equation$eval, ctx, e));
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$Generalise$testShape = F2(
	function (f, pt) {
		_v0$5:
		while (true) {
			switch (pt.$) {
				case 0:
					if (pt.a.$ === 5) {
						var a = pt.a.a;
						return f(a);
					} else {
						break _v0$5;
					}
				case 1:
					if (pt.a.$ === 4) {
						var _v1 = pt.a;
						var a = _v1.a;
						var b = _v1.b;
						return f(a) && f(b);
					} else {
						break _v0$5;
					}
				case 3:
					if (pt.a.$ === 3) {
						var a = pt.a.a;
						return f(a);
					} else {
						break _v0$5;
					}
				case 2:
					if (pt.a.$ === 1) {
						var _v2 = pt.a;
						var a = _v2.a;
						var b = _v2.b;
						return f(a) && f(b);
					} else {
						break _v0$5;
					}
				default:
					if (pt.a.$ === 1) {
						var a = pt.a.a;
						return f(a);
					} else {
						break _v0$5;
					}
			}
		}
		return true;
	});
var $author$project$Generalise$repr2Goal = F2(
	function (ctx, r) {
		var shapeR2Shape = function (s) {
			switch (s.$) {
				case 0:
					return $elm$core$Maybe$Just(
						_List_fromArray(
							[
								$author$project$Generalise$SOp(
								$author$project$Generalise$Square(1))
							]));
				case 3:
					var e = s.a;
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _List_fromArray(
								[
									$author$project$Generalise$SOp(
									$author$project$Generalise$Square(a))
								]);
						},
						A2($author$project$Equation$eval, ctx, e));
				case 1:
					var e = s.a;
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _List_fromArray(
								[
									$author$project$Generalise$ROp(
									A2($author$project$Generalise$Rect, 1, a))
								]);
						},
						A2($author$project$Equation$eval, ctx, e));
				case 2:
					var e = s.a;
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _List_fromArray(
								[
									$author$project$Generalise$LOp(
									$author$project$Generalise$L(a))
								]);
						},
						A2($author$project$Equation$eval, ctx, e));
				case 4:
					var e = s.a;
					return A2(
						$elm$core$Maybe$map,
						function (a) {
							return _List_fromArray(
								[
									$author$project$Generalise$TOp(
									$author$project$Generalise$Tri(a))
								]);
						},
						A2($author$project$Equation$eval, ctx, e));
				case 5:
					var e1 = s.a;
					var e2 = s.b;
					return A3(
						$elm$core$Maybe$map2,
						F2(
							function (a, b) {
								return _List_fromArray(
									[
										$author$project$Generalise$ROp(
										A2($author$project$Generalise$Rect, a, b))
									]);
							}),
						A2($author$project$Equation$eval, ctx, e1),
						A2($author$project$Equation$eval, ctx, e2));
				case 6:
					var _var = s.a.a4;
					var start = s.a.au;
					var end = s.a.aB;
					var repr = s.a.bq;
					var _v2 = _Utils_Tuple3(
						A2($author$project$Equation$eval, ctx, start),
						A2($author$project$Equation$eval, ctx, end),
						_var);
					if ((!_v2.a.$) && (!_v2.b.$)) {
						var startVal = _v2.a.a;
						var endVal = _v2.b.a;
						var n = _v2.c;
						return A3(
							$elm$core$List$foldl,
							F2(
								function (a, b) {
									return A2(
										$elm$core$Maybe$andThen,
										function (aa) {
											return A2(
												$elm$core$Maybe$map,
												$elm$core$Basics$append(aa),
												b);
										},
										a);
								}),
							$elm$core$Maybe$Just(_List_Nil),
							A2(
								$elm$core$List$map,
								function (val) {
									return A2(
										$author$project$Generalise$repr2Goal,
										A3($elm$core$Dict$insert, n, val, ctx),
										repr);
								},
								A2($elm$core$List$range, startVal, endVal)));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				default:
					var e = s.a;
					var repr = s.b;
					var _v3 = A2($author$project$Equation$eval, ctx, e);
					if (!_v3.$) {
						var repeatNo = _v3.a;
						return A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$List$repeat(repeatNo),
								$elm$core$List$concat),
							A2($author$project$Generalise$repr2Goal, ctx, repr));
					} else {
						return $elm$core$Maybe$Nothing;
					}
			}
		};
		var possibleGoal = A2(
			$elm$core$Maybe$map,
			$elm$core$List$filter(
				$author$project$Generalise$testShape(
					$elm$core$Basics$neq(0))),
			A3(
				$elm$core$List$foldl,
				F2(
					function (a, b) {
						return A2(
							$elm$core$Maybe$andThen,
							function (aa) {
								return A2(
									$elm$core$Maybe$map,
									$elm$core$Basics$append(aa),
									b);
							},
							a);
					}),
				$elm$core$Maybe$Just(_List_Nil),
				A2($elm$core$List$map, shapeR2Shape, r)));
		if (!possibleGoal.$) {
			var goal = possibleGoal.a;
			return A2(
				$elm$core$List$all,
				$author$project$Generalise$testShape(
					$elm$core$Basics$lt(0)),
				goal) ? $elm$core$Maybe$Just(goal) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Discover$buildGoal = F3(
	function (n1, n2, _v0) {
		var start = _v0.a;
		var goal = _v0.b;
		if (start.b && (!start.b.b)) {
			var r = start.a;
			var _v2 = _Utils_Tuple2(
				_Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n1)
								])),
						start),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n1)
								])),
						goal)),
				_Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n2)
								])),
						start),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n2)
								])),
						goal)));
			if ((((((((!_v2.a.a.$) && _v2.a.a.a.b) && (!_v2.a.a.a.b.b)) && (!_v2.a.b.$)) && (!_v2.b.a.$)) && _v2.b.a.a.b) && (!_v2.b.a.a.b.b)) && (!_v2.b.b.$)) {
				var _v3 = _v2.a;
				var _v4 = _v3.a.a;
				var sb = _v4.a;
				var gb = _v3.b.a;
				var _v5 = _v2.b;
				var _v6 = _v5.a.a;
				var ss = _v6.a;
				var gs = _v5.b.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple3(
						r,
						_Utils_Tuple2(sb, gb),
						_Utils_Tuple2(ss, gs)));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $author$project$Search$Done = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Search$NextF = function (a) {
	return {$: 3, a: a};
};
var $author$project$Search$NextL = function (a) {
	return {$: 4, a: a};
};
var $author$project$Search$NextR = function (a) {
	return {$: 1, a: a};
};
var $author$project$Search$NextS = function (a) {
	return {$: 0, a: a};
};
var $author$project$Search$NextT = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $author$project$Generalise$Frame = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Generalise$LCutS = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Generalise$LCutT = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Generalise$Rotate = function (a) {
	return {$: 3, a: a};
};
var $author$project$Generalise$Split4 = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var $author$project$Generalise$SplitDiaR = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Generalise$SplitDiaS = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Generalise$SplitEnds = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Generalise$SplitFrame = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $author$project$Generalise$SplitInnerSquare = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Generalise$SplitOuterFrame = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Generalise$SplitSide = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Generalise$SplitSquare = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Generalise$SplitTST = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Generalise$ToSquare = function (a) {
	return {$: 2, a: a};
};
var $author$project$Generalise$sortPt = F2(
	function (p1, p2) {
		var _v0 = _Utils_Tuple2(p1, p2);
		switch (_v0.a.$) {
			case 0:
				if (!_v0.b.$) {
					if (_v0.a.a.$ === 5) {
						if (_v0.b.a.$ === 5) {
							var a = _v0.a.a.a;
							var c = _v0.b.a.a;
							return A2($elm$core$Basics$compare, a, c);
						} else {
							return 0;
						}
					} else {
						return 1;
					}
				} else {
					return 0;
				}
			case 1:
				switch (_v0.b.$) {
					case 0:
						return 2;
					case 1:
						if (_v0.a.a.$ === 4) {
							if (_v0.b.a.$ === 4) {
								var _v1 = _v0.a.a;
								var a = _v1.a;
								var b = _v1.b;
								var _v2 = _v0.b.a;
								var c = _v2.a;
								var d = _v2.b;
								var _v3 = A2($elm$core$Basics$compare, a, c);
								if (_v3 === 1) {
									return A2($elm$core$Basics$compare, b, d);
								} else {
									var x = _v3;
									return x;
								}
							} else {
								var _v4 = _v0.a.a;
								return 0;
							}
						} else {
							return 1;
						}
					default:
						return 0;
				}
			case 3:
				switch (_v0.b.$) {
					case 0:
						return 2;
					case 1:
						return 2;
					case 3:
						if (_v0.a.a.$ === 3) {
							if (_v0.b.a.$ === 3) {
								var a = _v0.a.a.a;
								var c = _v0.b.a.a;
								return A2($elm$core$Basics$compare, a, c);
							} else {
								return 0;
							}
						} else {
							return 1;
						}
					default:
						return 0;
				}
			case 2:
				switch (_v0.b.$) {
					case 2:
						if (_v0.a.a.$ === 1) {
							if (_v0.b.a.$ === 1) {
								var _v5 = _v0.a.a;
								var a = _v5.a;
								var b = _v5.b;
								var _v6 = _v0.b.a;
								var c = _v6.a;
								var d = _v6.b;
								var _v7 = A2($elm$core$Basics$compare, a, c);
								if (_v7 === 1) {
									return A2($elm$core$Basics$compare, b, d);
								} else {
									var x = _v7;
									return x;
								}
							} else {
								var _v8 = _v0.a.a;
								return 0;
							}
						} else {
							return 1;
						}
					case 4:
						return 0;
					default:
						return 2;
				}
			default:
				if (_v0.b.$ === 4) {
					if (_v0.a.a.$ === 1) {
						if (_v0.b.a.$ === 1) {
							var a = _v0.a.a.a;
							var c = _v0.b.a.a;
							return A2($elm$core$Basics$compare, a, c);
						} else {
							return 0;
						}
					} else {
						return 1;
					}
				} else {
					return 2;
				}
		}
	});
var $author$project$Generalise$diffPt = F2(
	function (big, small) {
		diffPt:
		while (true) {
			var _v0 = _Utils_Tuple2(big, small);
			if (!_v0.b.b) {
				return big;
			} else {
				if (!_v0.a.b) {
					return _List_Nil;
				} else {
					var _v1 = _v0.a;
					var h1 = _v1.a;
					var t1 = _v1.b;
					var _v2 = _v0.b;
					var h2 = _v2.a;
					var t2 = _v2.b;
					var _v3 = A2($author$project$Generalise$sortPt, h1, h2);
					switch (_v3) {
						case 0:
							return A2(
								$elm$core$List$cons,
								h1,
								A2($author$project$Generalise$diffPt, t1, small));
						case 2:
							return A2(
								$elm$core$List$cons,
								h1,
								A2($author$project$Generalise$diffPt, t1, t2));
						default:
							var $temp$big = t1,
								$temp$small = t2;
							big = $temp$big;
							small = $temp$small;
							continue diffPt;
					}
				}
			}
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Search$insert = F2(
	function (x, l) {
		if (l.b) {
			var y = l.a;
			var ys = l.b;
			var _v1 = A2($author$project$Generalise$sortPt, x, y);
			switch (_v1) {
				case 1:
					return A2($elm$core$List$cons, x, l);
				case 0:
					return A2($elm$core$List$cons, x, l);
				default:
					return A2(
						$elm$core$List$cons,
						y,
						A2($author$project$Search$insert, x, ys));
			}
		} else {
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Heuristics$dots = function (shape) {
	_v0$5:
	while (true) {
		switch (shape.$) {
			case 0:
				if (shape.a.$ === 5) {
					var n = shape.a.a;
					return A2($elm$core$Basics$pow, n, 2);
				} else {
					break _v0$5;
				}
			case 1:
				if (shape.a.$ === 4) {
					var _v1 = shape.a;
					var n1 = _v1.a;
					var n2 = _v1.b;
					return n1 * n2;
				} else {
					break _v0$5;
				}
			case 3:
				if (shape.a.$ === 3) {
					var n = shape.a.a;
					return ((n * (n + 1)) / 2) | 0;
				} else {
					break _v0$5;
				}
			case 2:
				if (shape.a.$ === 1) {
					var _v2 = shape.a;
					var n1 = _v2.a;
					var n2 = _v2.b;
					return (4 * n2) * (n1 - n2);
				} else {
					break _v0$5;
				}
			default:
				if (shape.a.$ === 1) {
					var n = shape.a.a;
					return (2 * n) - 1;
				} else {
					break _v0$5;
				}
		}
	}
	return 0;
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Heuristics$reachable = F2(
	function (large, small) {
		var _v0 = _Utils_Tuple2(large, small);
		_v0$22:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (_v0.a.a.$ === 5) {
						switch (_v0.b.$) {
							case 0:
								if (_v0.b.a.$ === 5) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
							case 1:
								if (_v0.b.a.$ === 4) {
									var m = _v0.a.a.a;
									var _v1 = _v0.b.a;
									var n1 = _v1.a;
									var n2 = _v1.b;
									return ((n1 === 1) && (_Utils_cmp(n2, m) < 1)) || (((n2 === 1) && (_Utils_cmp(n1, m) < 1)) || (_Utils_cmp(
										$author$project$Heuristics$dots(small),
										(($author$project$Heuristics$dots(large) - 1) / 4) | 0) < 1));
								} else {
									break _v0$22;
								}
							case 3:
								if (_v0.b.a.$ === 3) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
							case 2:
								if (_v0.b.a.$ === 1) {
									var m = _v0.a.a.a;
									var _v2 = _v0.b.a;
									var n1 = _v2.a;
									var n2 = _v2.b;
									return _Utils_cmp(m, n1) > -1;
								} else {
									break _v0$22;
								}
							default:
								if (_v0.b.a.$ === 1) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
						}
					} else {
						break _v0$22;
					}
				case 1:
					if (_v0.a.a.$ === 4) {
						switch (_v0.b.$) {
							case 0:
								if (_v0.b.a.$ === 5) {
									var _v3 = _v0.a.a;
									var m1 = _v3.a;
									var m2 = _v3.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
							case 1:
								if (_v0.b.a.$ === 4) {
									var _v4 = _v0.a.a;
									var _v5 = _v0.b.a;
									return _Utils_cmp(
										$author$project$Heuristics$dots(large),
										$author$project$Heuristics$dots(small)) > -1;
								} else {
									break _v0$22;
								}
							case 3:
								if (_v0.b.a.$ === 3) {
									var _v6 = _v0.a.a;
									var m1 = _v6.a;
									var m2 = _v6.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
							case 2:
								if (_v0.b.a.$ === 1) {
									var _v7 = _v0.a.a;
									var m1 = _v7.a;
									var m2 = _v7.b;
									var _v8 = _v0.b.a;
									var n1 = _v8.a;
									var n2 = _v8.b;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1, m2),
										n1) > -1;
								} else {
									break _v0$22;
								}
							default:
								if (_v0.b.a.$ === 1) {
									var _v9 = _v0.a.a;
									var m1 = _v9.a;
									var m2 = _v9.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
						}
					} else {
						break _v0$22;
					}
				case 3:
					if (_v0.a.a.$ === 3) {
						switch (_v0.b.$) {
							case 0:
								if (_v0.b.a.$ === 5) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m - ((m / 2) | 0), n) > -1;
								} else {
									break _v0$22;
								}
							case 1:
								if (_v0.b.a.$ === 4) {
									var m = _v0.a.a.a;
									var _v10 = _v0.b.a;
									var n1 = _v10.a;
									var n2 = _v10.b;
									return ((n1 === 1) && (_Utils_cmp(n2, m) < 1)) || (((n2 === 1) && (_Utils_cmp(n1, m) < 1)) || (_Utils_cmp(
										$author$project$Heuristics$dots(small),
										((A2($elm$core$Basics$pow, m - ((m / 2) | 0), 2) - 1) / 4) | 0) < 1));
								} else {
									break _v0$22;
								}
							case 3:
								if (_v0.b.a.$ === 3) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
							case 2:
								if (_v0.b.a.$ === 1) {
									var m = _v0.a.a.a;
									var _v11 = _v0.b.a;
									var n1 = _v11.a;
									var n2 = _v11.b;
									return _Utils_cmp(m - ((m / 2) | 0), n1) > -1;
								} else {
									break _v0$22;
								}
							default:
								if (_v0.b.a.$ === 1) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
						}
					} else {
						break _v0$22;
					}
				case 2:
					if (_v0.a.a.$ === 1) {
						switch (_v0.b.$) {
							case 0:
								if (_v0.b.a.$ === 5) {
									var _v12 = _v0.a.a;
									var m1 = _v12.a;
									var m2 = _v12.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1 - m2, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
							case 1:
								if (_v0.b.a.$ === 4) {
									var _v13 = _v0.a.a;
									var m1 = _v13.a;
									var m2 = _v13.b;
									var _v14 = _v0.b.a;
									return _Utils_cmp(
										$author$project$Heuristics$dots(
											$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, m1 - m2, m2))),
										$author$project$Heuristics$dots(small)) > -1;
								} else {
									break _v0$22;
								}
							case 3:
								if (_v0.b.a.$ === 3) {
									var _v15 = _v0.a.a;
									var m1 = _v15.a;
									var m2 = _v15.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1 - m2, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
							case 2:
								if (_v0.b.a.$ === 1) {
									var _v16 = _v0.a.a;
									var m1 = _v16.a;
									var m2 = _v16.b;
									var _v17 = _v0.b.a;
									var n1 = _v17.a;
									var n2 = _v17.b;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1 - m2, m2),
										n1) > -1;
								} else {
									break _v0$22;
								}
							default:
								if (_v0.b.a.$ === 1) {
									var _v18 = _v0.a.a;
									var m1 = _v18.a;
									var m2 = _v18.b;
									var n = _v0.b.a.a;
									return _Utils_cmp(
										A2($elm$core$Basics$min, m1 - m2, m2),
										n) > -1;
								} else {
									break _v0$22;
								}
						}
					} else {
						break _v0$22;
					}
				default:
					if (_v0.a.a.$ === 1) {
						switch (_v0.b.$) {
							case 4:
								if (_v0.b.a.$ === 1) {
									var m = _v0.a.a.a;
									var n = _v0.b.a.a;
									return _Utils_cmp(m, n) > -1;
								} else {
									break _v0$22;
								}
							case 1:
								if (((_v0.b.a.$ === 4) && (_v0.b.a.a === 1)) && (_v0.b.a.b === 2)) {
									var m = _v0.a.a.a;
									var _v19 = _v0.b.a;
									return true;
								} else {
									break _v0$22;
								}
							default:
								break _v0$22;
						}
					} else {
						break _v0$22;
					}
			}
		}
		return _Utils_eq(
			small,
			$author$project$Generalise$SOp(
				$author$project$Generalise$Square(1))) || (_Utils_eq(
			small,
			$author$project$Generalise$ROp(
				A2($author$project$Generalise$Rect, 1, 1))) || (_Utils_eq(
			small,
			$author$project$Generalise$TOp(
				$author$project$Generalise$Tri(1))) || (_Utils_eq(
			small,
			$author$project$Generalise$FOp(
				A2($author$project$Generalise$Frame, 1, 1))) || _Utils_eq(
			small,
			$author$project$Generalise$LOp(
				$author$project$Generalise$L(1))))));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Heuristics$reachableGoalCheck = F2(
	function (large, goal) {
		return function (a) {
			return _Utils_cmp(
				a,
				$author$project$Heuristics$dots(large)) > -1;
		}(
			$elm$core$List$sum(
				A2(
					$elm$core$List$map,
					$author$project$Heuristics$dots,
					A2(
						$elm$core$List$filter,
						$author$project$Heuristics$reachable(large),
						goal))));
	});
var $author$project$Search$findProofF = F6(
	function (ff, build, found, rGoal, goal, backtrack) {
		if (ff.$ === 1) {
			var n1 = ff.a;
			var n2 = ff.b;
			var splitframeSearch = F2(
				function (bt, _v23) {
					return (_Utils_cmp(n1, n2) > 0) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextR(
							{
								a: F2(
									function (r1, fo1) {
										return $author$project$Search$NextR(
											{
												a: F2(
													function (r2, fo2) {
														return $author$project$Search$NextR(
															{
																a: F2(
																	function (r3, fo3) {
																		return $author$project$Search$NextR(
																			{
																				a: F2(
																					function (r4, fo4) {
																						return A2(
																							build,
																							A4($author$project$Generalise$SplitFrame, r1, r2, r3, r4),
																							fo4);
																					}),
																				b: fo3,
																				c: A2($author$project$Generalise$diffPt, goal, fo3),
																				n: false,
																				y: A2($author$project$Generalise$Rect, n2, n1 - n2)
																			});
																	}),
																b: fo2,
																c: A2($author$project$Generalise$diffPt, goal, fo2),
																n: false,
																y: A2($author$project$Generalise$Rect, n2, n1 - n2)
															});
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												n: false,
												y: A2($author$project$Generalise$Rect, n1 - n2, n2)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								n: false,
								y: A2($author$project$Generalise$Rect, n1 - n2, n2)
							}),
						bt) : bt(0);
				});
			var shape = function () {
				var _v22 = _Utils_Tuple2(n1, n2);
				if ((_v22.a === 1) && (_v22.b === 1)) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$FOp(ff);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A3(
					$author$project$Search$findProofHelper,
					goal,
					A2(
						build,
						ff,
						A2($author$project$Search$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitframeSearch(backtrack));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Search$findProofHelper = F3(
	function (goal, points, backtrack) {
		switch (points.$) {
			case 0:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$SOp(shape),
					rGoal)) ? backtrack(0) : A6($author$project$Search$findProofS, shape, build, found, rGoal, goal, backtrack);
			case 1:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				var rotate = points.a.n;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$ROp(shape),
					rGoal)) ? backtrack(0) : A7($author$project$Search$findProofR, rotate, shape, build, found, rGoal, goal, backtrack);
			case 2:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$TOp(shape),
					rGoal)) ? backtrack(0) : A6($author$project$Search$findProofT, shape, build, found, rGoal, goal, backtrack);
			case 3:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$FOp(shape),
					rGoal)) ? backtrack(0) : A6($author$project$Search$findProofF, shape, build, found, rGoal, goal, backtrack);
			case 4:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$LOp(shape),
					rGoal)) ? backtrack(0) : A6($author$project$Search$findProofL, shape, build, found, rGoal, goal, backtrack);
			default:
				var pt = points.a;
				var found = points.b;
				return _Utils_eq(found, goal) ? $elm$core$Maybe$Just(pt) : backtrack(0);
		}
	});
var $author$project$Search$findProofL = F6(
	function (ll, build, found, rGoal, goal, backtrack) {
		if (ll.$ === 1) {
			var n = ll.a;
			var splitendsSearch = F2(
				function (bt, _v19) {
					return (n > 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextR(
							{
								a: F2(
									function (r, fo1) {
										return $author$project$Search$NextL(
											{
												a: F2(
													function (l, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitEnds, r, l),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$L(n - 1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								n: false,
								y: A2($author$project$Generalise$Rect, 1, 2)
							}),
						bt) : bt(0);
				});
			var shape = function () {
				if (n === 1) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$LOp(ll);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A3(
					$author$project$Search$findProofHelper,
					goal,
					A2(
						build,
						ll,
						A2($author$project$Search$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitendsSearch(backtrack));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Search$findProofR = F7(
	function (rotate, rr, build, found, rGoal, goal, backtrack) {
		if (rr.$ === 4) {
			var n1 = rr.a;
			var n2 = rr.b;
			var tosquareSearch = F2(
				function (bt, _v16) {
					return _Utils_eq(n1, n2) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextS(
							{
								a: F2(
									function (s, fo1) {
										return A2(
											build,
											$author$project$Generalise$ToSquare(s),
											fo1);
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Square(n1)
							}),
						bt) : bt(0);
				});
			var splitsquareSearch = F2(
				function (bt, _v15) {
					return (_Utils_cmp(n1, n2) > 0) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextS(
							{
								a: F2(
									function (s, fo1) {
										return $author$project$Search$NextR(
											{
												a: F2(
													function (r, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitSquare, s, r),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												n: false,
												y: A2($author$project$Generalise$Rect, n1 - n2, n2)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Square(n2)
							}),
						bt) : ((_Utils_cmp(n2, n1) > 0) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextS(
							{
								a: F2(
									function (s, fo1) {
										return $author$project$Search$NextR(
											{
												a: F2(
													function (r, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitSquare, s, r),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												n: false,
												y: A2($author$project$Generalise$Rect, n1, n2 - n1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Square(n1)
							}),
						bt) : bt(0));
				});
			var splitdiaSearch = F2(
				function (bt, _v14) {
					return ((n1 - n2) === 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextT(
							{
								a: F2(
									function (t1, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t2, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitDiaR, t1, t2),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri(n2)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Tri(n2)
							}),
						bt) : (((n2 - n1) === 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextT(
							{
								a: F2(
									function (t1, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t2, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitDiaR, t1, t2),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri(n1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Tri(n1)
							}),
						bt) : bt(0));
				});
			var shape = function () {
				var _v13 = _Utils_Tuple2(n1, n2);
				if ((_v13.a === 1) && (_v13.b === 1)) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$ROp(rr);
				}
			}();
			var rotateSearch = F2(
				function (bt, _v12) {
					return (!rotate) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextR(
							{
								a: F2(
									function (r, fo1) {
										return A2(
											build,
											$author$project$Generalise$Rotate(r),
											fo1);
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								n: true,
								y: A2($author$project$Generalise$Rect, n2, n1)
							}),
						bt) : bt(0);
				});
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A3(
					$author$project$Search$findProofHelper,
					goal,
					A2(
						build,
						rr,
						A2($author$project$Search$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitdiaSearch(
					splitsquareSearch(
						tosquareSearch(
							rotateSearch(backtrack)))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Search$findProofS = F6(
	function (ss, build, found, rGoal, goal, backtrack) {
		if (ss.$ === 5) {
			var n = ss.a;
			var splitouterSearch = F2(
				function (bt, _v10) {
					return (n >= 3) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextF(
							{
								a: F2(
									function (f, fo1) {
										return $author$project$Search$NextS(
											{
												a: F2(
													function (s, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitOuterFrame, f, s),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Square(n - 2)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: A2($author$project$Generalise$Frame, n, 1)
							}),
						bt) : bt(0);
				});
			var splitinnerSearch = F2(
				function (bt, _v9) {
					return (n >= 3) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextF(
							{
								a: F2(
									function (f, fo1) {
										return $author$project$Search$NextS(
											{
												a: F2(
													function (s, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitInnerSquare, f, s),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Square(n - (2 * (((n - 1) / 2) | 0)))
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: A2($author$project$Generalise$Frame, n, ((n - 1) / 2) | 0)
							}),
						bt) : bt(0);
				});
			var splitdiaSearch = F2(
				function (bt, _v8) {
					return (n > 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextT(
							{
								a: F2(
									function (t1, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t2, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitDiaS, t1, t2),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri(n - 1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Tri(n)
							}),
						bt) : bt(0);
				});
			var split4Search = F2(
				function (bt, _v7) {
					return ((n >= 2) && (!A2($elm$core$Basics$modBy, 2, n))) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextS(
							{
								a: F2(
									function (s1, fo1) {
										return $author$project$Search$NextS(
											{
												a: F2(
													function (s2, fo2) {
														return $author$project$Search$NextS(
															{
																a: F2(
																	function (s3, fo3) {
																		return $author$project$Search$NextS(
																			{
																				a: F2(
																					function (s4, fo4) {
																						return A2(
																							build,
																							A4($author$project$Generalise$Split4, s1, s2, s3, s3),
																							fo4);
																					}),
																				b: fo3,
																				c: A2($author$project$Generalise$diffPt, goal, fo3),
																				y: $author$project$Generalise$Square((n / 2) | 0)
																			});
																	}),
																b: fo2,
																c: A2($author$project$Generalise$diffPt, goal, fo2),
																y: $author$project$Generalise$Square((n / 2) | 0)
															});
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Square((n / 2) | 0)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Square((n / 2) | 0)
							}),
						bt) : bt(0);
				});
			var noopSearch = function (bt) {
				return A2(
					$elm$core$List$member,
					$author$project$Generalise$SOp(ss),
					rGoal) ? A3(
					$author$project$Search$findProofHelper,
					goal,
					A2(
						build,
						ss,
						A2(
							$author$project$Search$insert,
							$author$project$Generalise$SOp(ss),
							found)),
					bt) : bt(0);
			};
			var lcutSearch = F2(
				function (bt, _v6) {
					return (n > 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextL(
							{
								a: F2(
									function (l, fo1) {
										return $author$project$Search$NextS(
											{
												a: F2(
													function (s, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$LCutS, l, s),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Square(n - 1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$L(n)
							}),
						bt) : bt(0);
				});
			return noopSearch(
				splitdiaSearch(
					lcutSearch(
						splitinnerSearch(
							splitouterSearch(
								split4Search(backtrack))))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Search$findProofT = F6(
	function (tt, build, found, rGoal, goal, backtrack) {
		if (tt.$ === 3) {
			var n = tt.a;
			var splittstSearch = F2(
				function (bt, _v4) {
					return (n > 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextT(
							{
								a: F2(
									function (t1, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t2, fo2) {
														return $author$project$Search$NextS(
															{
																a: F2(
																	function (s, fo3) {
																		return A2(
																			build,
																			A3($author$project$Generalise$SplitTST, t1, s, t2),
																			fo3);
																	}),
																b: fo2,
																c: A2($author$project$Generalise$diffPt, goal, fo2),
																y: $author$project$Generalise$Square(n - ((n / 2) | 0))
															});
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri((n / 2) | 0)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Tri((n / 2) | 0)
							}),
						bt) : bt(0);
				});
			var splitsideSearch = F2(
				function (bt, _v3) {
					return (n > 1) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextR(
							{
								a: F2(
									function (r, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$SplitSide, r, t),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri(n - 1)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								n: false,
								y: A2($author$project$Generalise$Rect, 1, n)
							}),
						bt) : bt(0);
				});
			var shape = function () {
				switch (n) {
					case 1:
						return $author$project$Generalise$SOp(
							$author$project$Generalise$Square(1));
					case 2:
						return $author$project$Generalise$LOp(
							$author$project$Generalise$L(2));
					default:
						return $author$project$Generalise$TOp(tt);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A3(
					$author$project$Search$findProofHelper,
					goal,
					A2(
						build,
						tt,
						A2($author$project$Search$insert, shape, found)),
					bt) : bt(0);
			};
			var lcutSearch = F2(
				function (bt, _v1) {
					return (n > 2) ? A3(
						$author$project$Search$findProofHelper,
						goal,
						$author$project$Search$NextL(
							{
								a: F2(
									function (l, fo1) {
										return $author$project$Search$NextT(
											{
												a: F2(
													function (t, fo2) {
														return A2(
															build,
															A2($author$project$Generalise$LCutT, l, t),
															fo2);
													}),
												b: fo1,
												c: A2($author$project$Generalise$diffPt, goal, fo1),
												y: $author$project$Generalise$Tri(n - 2)
											});
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$L(n)
							}),
						bt) : bt(0);
				});
			return noopSearch(
				splittstSearch(
					lcutSearch(
						splitsideSearch(backtrack))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$normalizeG = function (pt) {
	_v0$5:
	while (true) {
		switch (pt.$) {
			case 1:
				if (((pt.a.$ === 4) && (pt.a.a === 1)) && (pt.a.b === 1)) {
					var _v1 = pt.a;
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					break _v0$5;
				}
			case 3:
				if (pt.a.$ === 3) {
					switch (pt.a.a) {
						case 1:
							return $author$project$Generalise$SOp(
								$author$project$Generalise$Square(1));
						case 2:
							return $author$project$Generalise$LOp(
								$author$project$Generalise$L(2));
						default:
							break _v0$5;
					}
				} else {
					break _v0$5;
				}
			case 2:
				if (((pt.a.$ === 1) && (pt.a.a === 1)) && (pt.a.b === 1)) {
					var _v2 = pt.a;
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					break _v0$5;
				}
			case 4:
				if ((pt.a.$ === 1) && (pt.a.a === 1)) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					break _v0$5;
				}
			default:
				break _v0$5;
		}
	}
	return pt;
};
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Search$findProof = F2(
	function (start, goal) {
		var sGoal = A2(
			$elm$core$List$sortWith,
			$author$project$Generalise$sortPt,
			A2($elm$core$List$map, $author$project$Generalise$normalizeG, goal));
		switch (start.$) {
			case 0:
				var s = start.a;
				return A3(
					$author$project$Search$findProofHelper,
					sGoal,
					$author$project$Search$NextS(
						{
							a: A2($elm$core$Basics$composeR, $author$project$Generalise$SOp, $author$project$Search$Done),
							b: _List_Nil,
							c: sGoal,
							y: s
						}),
					$elm$core$Basics$always($elm$core$Maybe$Nothing));
			case 1:
				var r = start.a;
				return A3(
					$author$project$Search$findProofHelper,
					sGoal,
					$author$project$Search$NextR(
						{
							a: A2($elm$core$Basics$composeR, $author$project$Generalise$ROp, $author$project$Search$Done),
							b: _List_Nil,
							c: sGoal,
							n: false,
							y: r
						}),
					$elm$core$Basics$always($elm$core$Maybe$Nothing));
			case 3:
				var t = start.a;
				return A3(
					$author$project$Search$findProofHelper,
					sGoal,
					$author$project$Search$NextT(
						{
							a: A2($elm$core$Basics$composeR, $author$project$Generalise$TOp, $author$project$Search$Done),
							b: _List_Nil,
							c: sGoal,
							y: t
						}),
					$elm$core$Basics$always($elm$core$Maybe$Nothing));
			case 2:
				var f = start.a;
				return A3(
					$author$project$Search$findProofHelper,
					sGoal,
					$author$project$Search$NextF(
						{
							a: A2($elm$core$Basics$composeR, $author$project$Generalise$FOp, $author$project$Search$Done),
							b: _List_Nil,
							c: sGoal,
							y: f
						}),
					$elm$core$Basics$always($elm$core$Maybe$Nothing));
			default:
				var l = start.a;
				return A3(
					$author$project$Search$findProofHelper,
					sGoal,
					$author$project$Search$NextL(
						{
							a: A2($elm$core$Basics$composeR, $author$project$Generalise$LOp, $author$project$Search$Done),
							b: _List_Nil,
							c: sGoal,
							y: l
						}),
					$elm$core$Basics$always($elm$core$Maybe$Nothing));
		}
	});
var $lynn$elm_arithmetic$Arithmetic$divides = F2(
	function (a, b) {
		return !A2($elm$core$Basics$modBy, a, b);
	});
var $lynn$elm_arithmetic$Arithmetic$primeFactors = function (n) {
	var go = F3(
		function (p, num, factors) {
			go:
			while (true) {
				if (_Utils_cmp(p * p, num) > 0) {
					return _Utils_ap(
						$elm$core$List$reverse(factors),
						_List_fromArray(
							[num]));
				} else {
					if (!A2($elm$core$Basics$modBy, p, num)) {
						var $temp$p = p,
							$temp$num = (num / p) | 0,
							$temp$factors = A2($elm$core$List$cons, p, factors);
						p = $temp$p;
						num = $temp$num;
						factors = $temp$factors;
						continue go;
					} else {
						var $temp$p = (p + 1) + A2($elm$core$Basics$modBy, 2, p),
							$temp$num = num,
							$temp$factors = factors;
						p = $temp$p;
						num = $temp$num;
						factors = $temp$factors;
						continue go;
					}
				}
			}
		});
	return (n <= 1) ? _List_Nil : A3(go, 2, n, _List_Nil);
};
var $lynn$elm_arithmetic$Arithmetic$primeExponents = function () {
	var runLengthCons = F2(
		function (x, acc) {
			if (!acc.b) {
				return _List_fromArray(
					[
						_Utils_Tuple2(x, 1)
					]);
			} else {
				var _v1 = acc.a;
				var y = _v1.a;
				var n = _v1.b;
				var rest = acc.b;
				return _Utils_eq(x, y) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple2(y, n + 1),
					rest) : A2(
					$elm$core$List$cons,
					_Utils_Tuple2(x, 1),
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(y, n),
						rest));
			}
		});
	return A2(
		$elm$core$Basics$composeR,
		$lynn$elm_arithmetic$Arithmetic$primeFactors,
		A2($elm$core$List$foldr, runLengthCons, _List_Nil));
}();
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $lynn$elm_arithmetic$Arithmetic$divisors = function () {
	var f = function (_v0) {
		var p = _v0.a;
		var e = _v0.b;
		return $elm$core$List$concatMap(
			function (a) {
				return A2(
					$elm$core$List$map,
					function (x) {
						return A2($elm$core$Basics$pow, p, x) * a;
					},
					A2($elm$core$List$range, 0, e));
			});
	};
	return A2(
		$elm$core$Basics$composeR,
		$lynn$elm_arithmetic$Arithmetic$primeExponents,
		A2(
			$elm$core$Basics$composeR,
			A2(
				$elm$core$List$foldr,
				f,
				_List_fromArray(
					[1])),
			$elm$core$List$sort));
}();
var $author$project$Generalise$RecurseF = {$: 2};
var $author$project$Generalise$RecurseL = {$: 2};
var $author$project$Generalise$RecurseR = {$: 5};
var $author$project$Generalise$RecurseS = {$: 6};
var $author$project$Generalise$RecurseT = {$: 4};
var $author$project$Generalise$ifFailed = F2(
	function (next, prev) {
		if (prev.$ === 1) {
			return next;
		} else {
			return prev;
		}
	});
var $author$project$Generalise$fEq = F2(
	function (f1, f2) {
		var _v36 = _Utils_Tuple2(f1, f2);
		_v36$1:
		while (true) {
			_v36$4:
			while (true) {
				switch (_v36.a.$) {
					case 2:
						var _v37 = _v36.a;
						return true;
					case 1:
						switch (_v36.b.$) {
							case 2:
								break _v36$1;
							case 1:
								var _v39 = _v36.a;
								var _v40 = _v36.b;
								return true;
							default:
								break _v36$4;
						}
					case 0:
						switch (_v36.b.$) {
							case 2:
								break _v36$1;
							case 0:
								var _v41 = _v36.a;
								var r11 = _v41.a;
								var r12 = _v41.b;
								var r13 = _v41.c;
								var r14 = _v41.d;
								var _v42 = _v36.b;
								var r21 = _v42.a;
								var r22 = _v42.b;
								var r23 = _v42.c;
								var r24 = _v42.d;
								return A2($author$project$Generalise$rEq, r11, r21) && (A2($author$project$Generalise$rEq, r12, r22) && (A2($author$project$Generalise$rEq, r13, r23) && A2($author$project$Generalise$rEq, r14, r24)));
							default:
								break _v36$4;
						}
					default:
						if (_v36.b.$ === 2) {
							break _v36$1;
						} else {
							break _v36$4;
						}
				}
			}
			return false;
		}
		var _v38 = _v36.b;
		return true;
	});
var $author$project$Generalise$lEq = F2(
	function (l1, l2) {
		var _v31 = _Utils_Tuple2(l1, l2);
		_v31$1:
		while (true) {
			_v31$4:
			while (true) {
				switch (_v31.a.$) {
					case 2:
						var _v32 = _v31.a;
						return true;
					case 1:
						switch (_v31.b.$) {
							case 2:
								break _v31$1;
							case 1:
								return true;
							default:
								break _v31$4;
						}
					case 0:
						switch (_v31.b.$) {
							case 2:
								break _v31$1;
							case 0:
								var _v34 = _v31.a;
								var r11 = _v34.a;
								var l11 = _v34.b;
								var _v35 = _v31.b;
								var r21 = _v35.a;
								var l21 = _v35.b;
								return A2($author$project$Generalise$rEq, r11, r21) && A2($author$project$Generalise$lEq, l11, l21);
							default:
								break _v31$4;
						}
					default:
						if (_v31.b.$ === 2) {
							break _v31$1;
						} else {
							break _v31$4;
						}
				}
			}
			return false;
		}
		var _v33 = _v31.b;
		return true;
	});
var $author$project$Generalise$rEq = F2(
	function (r1, r2) {
		rEq:
		while (true) {
			var _v22 = _Utils_Tuple2(r1, r2);
			_v22$1:
			while (true) {
				_v22$7:
				while (true) {
					switch (_v22.a.$) {
						case 5:
							var _v23 = _v22.a;
							return true;
						case 4:
							switch (_v22.b.$) {
								case 5:
									break _v22$1;
								case 4:
									var _v25 = _v22.a;
									var _v26 = _v22.b;
									return true;
								default:
									break _v22$7;
							}
						case 0:
							switch (_v22.b.$) {
								case 5:
									break _v22$1;
								case 0:
									var _v27 = _v22.a;
									var s11 = _v27.a;
									var r11 = _v27.b;
									var _v28 = _v22.b;
									var s21 = _v28.a;
									var r21 = _v28.b;
									return A2($author$project$Generalise$sEq, s11, s21) && A2($author$project$Generalise$rEq, r11, r21);
								default:
									break _v22$7;
							}
						case 1:
							switch (_v22.b.$) {
								case 5:
									break _v22$1;
								case 1:
									var _v29 = _v22.a;
									var t11 = _v29.a;
									var t12 = _v29.b;
									var _v30 = _v22.b;
									var t21 = _v30.a;
									var t22 = _v30.b;
									return A2($author$project$Generalise$tEq, t11, t21) && A2($author$project$Generalise$tEq, t12, t22);
								default:
									break _v22$7;
							}
						case 3:
							switch (_v22.b.$) {
								case 5:
									break _v22$1;
								case 3:
									var rr1 = _v22.a.a;
									var rr2 = _v22.b.a;
									var $temp$r1 = rr1,
										$temp$r2 = rr2;
									r1 = $temp$r1;
									r2 = $temp$r2;
									continue rEq;
								default:
									break _v22$7;
							}
						case 2:
							switch (_v22.b.$) {
								case 5:
									break _v22$1;
								case 2:
									var s1 = _v22.a.a;
									var s2 = _v22.b.a;
									return A2($author$project$Generalise$sEq, s1, s2);
								default:
									break _v22$7;
							}
						default:
							if (_v22.b.$ === 5) {
								break _v22$1;
							} else {
								break _v22$7;
							}
					}
				}
				return false;
			}
			var _v24 = _v22.b;
			return true;
		}
	});
var $author$project$Generalise$sEq = F2(
	function (s1, s2) {
		var _v9 = _Utils_Tuple2(s1, s2);
		_v9$1:
		while (true) {
			_v9$8:
			while (true) {
				switch (_v9.a.$) {
					case 6:
						var _v10 = _v9.a;
						return true;
					case 5:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 5:
								return true;
							default:
								break _v9$8;
						}
					case 0:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 0:
								var _v12 = _v9.a;
								var l11 = _v12.a;
								var s11 = _v12.b;
								var _v13 = _v9.b;
								var l21 = _v13.a;
								var s21 = _v13.b;
								return A2($author$project$Generalise$lEq, l11, l21) && A2($author$project$Generalise$sEq, s11, s21);
							default:
								break _v9$8;
						}
					case 3:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 3:
								var _v14 = _v9.a;
								var s11 = _v14.a;
								var s12 = _v14.b;
								var s13 = _v14.c;
								var s14 = _v14.d;
								var _v15 = _v9.b;
								var s21 = _v15.a;
								var s22 = _v15.b;
								var s23 = _v15.c;
								var s24 = _v15.d;
								return A2($author$project$Generalise$sEq, s11, s21) && (A2($author$project$Generalise$sEq, s12, s22) && (A2($author$project$Generalise$sEq, s13, s23) && A2($author$project$Generalise$sEq, s14, s24)));
							default:
								break _v9$8;
						}
					case 4:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 4:
								var _v16 = _v9.a;
								var t11 = _v16.a;
								var t12 = _v16.b;
								var _v17 = _v9.b;
								var t21 = _v17.a;
								var t22 = _v17.b;
								return A2($author$project$Generalise$tEq, t11, t21) && A2($author$project$Generalise$tEq, t12, t22);
							default:
								break _v9$8;
						}
					case 2:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 2:
								var _v18 = _v9.a;
								var f11 = _v18.a;
								var s11 = _v18.b;
								var _v19 = _v9.b;
								var f21 = _v19.a;
								var s21 = _v19.b;
								return A2($author$project$Generalise$fEq, f11, f21) && A2($author$project$Generalise$sEq, s11, s21);
							default:
								break _v9$8;
						}
					case 1:
						switch (_v9.b.$) {
							case 6:
								break _v9$1;
							case 1:
								var _v20 = _v9.a;
								var f11 = _v20.a;
								var s11 = _v20.b;
								var _v21 = _v9.b;
								var f21 = _v21.a;
								var s21 = _v21.b;
								return A2($author$project$Generalise$fEq, f11, f21) && A2($author$project$Generalise$sEq, s11, s21);
							default:
								break _v9$8;
						}
					default:
						if (_v9.b.$ === 6) {
							break _v9$1;
						} else {
							break _v9$8;
						}
				}
			}
			return false;
		}
		var _v11 = _v9.b;
		return true;
	});
var $author$project$Generalise$tEq = F2(
	function (t1, t2) {
		var _v0 = _Utils_Tuple2(t1, t2);
		_v0$1:
		while (true) {
			_v0$6:
			while (true) {
				switch (_v0.a.$) {
					case 4:
						var _v1 = _v0.a;
						return true;
					case 3:
						switch (_v0.b.$) {
							case 4:
								break _v0$1;
							case 3:
								return true;
							default:
								break _v0$6;
						}
					case 1:
						switch (_v0.b.$) {
							case 4:
								break _v0$1;
							case 1:
								var _v3 = _v0.a;
								var l11 = _v3.a;
								var t11 = _v3.b;
								var _v4 = _v0.b;
								var l21 = _v4.a;
								var t21 = _v4.b;
								return A2($author$project$Generalise$lEq, l11, l21) && A2($author$project$Generalise$tEq, t11, t21);
							default:
								break _v0$6;
						}
					case 0:
						switch (_v0.b.$) {
							case 4:
								break _v0$1;
							case 0:
								var _v5 = _v0.a;
								var t11 = _v5.a;
								var s11 = _v5.b;
								var t12 = _v5.c;
								var _v6 = _v0.b;
								var t21 = _v6.a;
								var s21 = _v6.b;
								var t22 = _v6.c;
								return A2($author$project$Generalise$tEq, t11, t21) && (A2($author$project$Generalise$sEq, s11, s21) && A2($author$project$Generalise$tEq, t12, t22));
							default:
								break _v0$6;
						}
					case 2:
						switch (_v0.b.$) {
							case 4:
								break _v0$1;
							case 2:
								var _v7 = _v0.a;
								var r11 = _v7.a;
								var t11 = _v7.b;
								var _v8 = _v0.b;
								var r21 = _v8.a;
								var t21 = _v8.b;
								return A2($author$project$Generalise$rEq, r11, r21) && A2($author$project$Generalise$tEq, t11, t21);
							default:
								break _v0$6;
						}
					default:
						if (_v0.b.$ === 4) {
							break _v0$1;
						} else {
							break _v0$6;
						}
				}
			}
			return false;
		}
		var _v2 = _v0.b;
		return true;
	});
var $author$project$Generalise$ptEq = F2(
	function (p1, p2) {
		var _v0 = _Utils_Tuple2(p1, p2);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var s1 = _v0.a.a;
						var s2 = _v0.b.a;
						return A2($author$project$Generalise$sEq, s1, s2);
					} else {
						break _v0$5;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var r1 = _v0.a.a;
						var r2 = _v0.b.a;
						return A2($author$project$Generalise$rEq, r1, r2);
					} else {
						break _v0$5;
					}
				case 3:
					if (_v0.b.$ === 3) {
						var t1 = _v0.a.a;
						var t2 = _v0.b.a;
						return A2($author$project$Generalise$tEq, t1, t2);
					} else {
						break _v0$5;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var f1 = _v0.a.a;
						var f2 = _v0.b.a;
						return A2($author$project$Generalise$fEq, f1, f2);
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 4) {
						var l1 = _v0.a.a;
						var l2 = _v0.b.a;
						return A2($author$project$Generalise$lEq, l1, l2);
					} else {
						break _v0$5;
					}
			}
		}
		return false;
	});
var $author$project$Generalise$findDifferenceF = F3(
	function (diff, small, large) {
		if (A2(
			$author$project$Generalise$ptEq,
			small,
			$author$project$Generalise$FOp(large))) {
			return $elm$core$Maybe$Just(
				diff($author$project$Generalise$RecurseF));
		} else {
			switch (large.$) {
				case 1:
					return $elm$core$Maybe$Nothing;
				case 2:
					return $elm$core$Maybe$Nothing;
				case 3:
					return $elm$core$Maybe$Nothing;
				case 4:
					return $elm$core$Maybe$Nothing;
				default:
					var r1 = large.a;
					var r2 = large.b;
					var r3 = large.c;
					var r4 = large.d;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceR,
							A2(
								$elm$core$Basics$composeL,
								diff,
								A3($author$project$Generalise$SplitFrame, r1, r2, r3)),
							small,
							r4),
						A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$findDifferenceR,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, r1, r2, x, r4);
									}),
								small,
								r3),
							A2(
								$author$project$Generalise$ifFailed,
								A3(
									$author$project$Generalise$findDifferenceR,
									A2(
										$elm$core$Basics$composeL,
										diff,
										function (x) {
											return A4($author$project$Generalise$SplitFrame, r1, x, r3, r4);
										}),
									small,
									r2),
								A3(
									$author$project$Generalise$findDifferenceR,
									A2(
										$elm$core$Basics$composeL,
										diff,
										function (x) {
											return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
										}),
									small,
									r1))));
			}
		}
	});
var $author$project$Generalise$findDifferenceL = F3(
	function (diff, small, large) {
		if (A2(
			$author$project$Generalise$ptEq,
			small,
			$author$project$Generalise$LOp(large))) {
			return $elm$core$Maybe$Just(
				diff($author$project$Generalise$RecurseL));
		} else {
			switch (large.$) {
				case 1:
					return $elm$core$Maybe$Nothing;
				case 2:
					return $elm$core$Maybe$Nothing;
				case 3:
					return $elm$core$Maybe$Nothing;
				case 4:
					return $elm$core$Maybe$Nothing;
				default:
					var r = large.a;
					var l = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceL,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$SplitEnds(r)),
							small,
							l),
						A3(
							$author$project$Generalise$findDifferenceR,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$SplitEnds, x, l);
								}),
							small,
							r));
			}
		}
	});
var $author$project$Generalise$findDifferenceR = F3(
	function (diff, small, large) {
		findDifferenceR:
		while (true) {
			if (A2(
				$author$project$Generalise$ptEq,
				small,
				$author$project$Generalise$ROp(large))) {
				return $elm$core$Maybe$Just(
					diff($author$project$Generalise$RecurseR));
			} else {
				switch (large.$) {
					case 4:
						return $elm$core$Maybe$Nothing;
					case 5:
						return $elm$core$Maybe$Nothing;
					case 6:
						return $elm$core$Maybe$Nothing;
					case 7:
						return $elm$core$Maybe$Nothing;
					case 0:
						var s = large.a;
						var r = large.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$findDifferenceR,
								A2(
									$elm$core$Basics$composeL,
									diff,
									$author$project$Generalise$SplitSquare(s)),
								small,
								r),
							A3(
								$author$project$Generalise$findDifferenceS,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A2($author$project$Generalise$SplitSquare, x, r);
									}),
								small,
								s));
					case 1:
						var t1 = large.a;
						var t2 = large.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$findDifferenceT,
								A2(
									$elm$core$Basics$composeL,
									diff,
									$author$project$Generalise$SplitDiaR(t1)),
								small,
								t2),
							A3(
								$author$project$Generalise$findDifferenceT,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A2($author$project$Generalise$SplitDiaR, x, t2);
									}),
								small,
								t1));
					case 2:
						var s = large.a;
						return A3(
							$author$project$Generalise$findDifferenceS,
							A2($elm$core$Basics$composeL, diff, $author$project$Generalise$ToSquare),
							small,
							s);
					default:
						var r = large.a;
						var $temp$diff = A2($elm$core$Basics$composeL, diff, $author$project$Generalise$Rotate),
							$temp$small = small,
							$temp$large = r;
						diff = $temp$diff;
						small = $temp$small;
						large = $temp$large;
						continue findDifferenceR;
				}
			}
		}
	});
var $author$project$Generalise$findDifferenceS = F3(
	function (diff, small, large) {
		if (A2(
			$author$project$Generalise$ptEq,
			small,
			$author$project$Generalise$SOp(large))) {
			return $elm$core$Maybe$Just(
				diff($author$project$Generalise$RecurseS));
		} else {
			switch (large.$) {
				case 5:
					return $elm$core$Maybe$Nothing;
				case 6:
					return $elm$core$Maybe$Nothing;
				case 7:
					return $elm$core$Maybe$Nothing;
				case 8:
					return $elm$core$Maybe$Nothing;
				case 3:
					var s1 = large.a;
					var s2 = large.b;
					var s3 = large.c;
					var s4 = large.d;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceS,
							A2(
								$elm$core$Basics$composeL,
								diff,
								A3($author$project$Generalise$Split4, s1, s2, s3)),
							small,
							s4),
						A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$findDifferenceS,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A4($author$project$Generalise$Split4, s1, s2, x, s4);
									}),
								small,
								s3),
							A2(
								$author$project$Generalise$ifFailed,
								A3(
									$author$project$Generalise$findDifferenceS,
									A2(
										$elm$core$Basics$composeL,
										diff,
										function (x) {
											return A4($author$project$Generalise$Split4, s1, x, s3, s4);
										}),
									small,
									s2),
								A3(
									$author$project$Generalise$findDifferenceS,
									A2(
										$elm$core$Basics$composeL,
										diff,
										function (x) {
											return A4($author$project$Generalise$Split4, x, s2, s3, s4);
										}),
									small,
									s1))));
				case 0:
					var l = large.a;
					var s = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A2(
							$author$project$Generalise$findDifferenceS(
								A2(
									$elm$core$Basics$composeL,
									diff,
									$author$project$Generalise$LCutS(l))),
							small,
							s),
						A3(
							$author$project$Generalise$findDifferenceL,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$LCutS, x, s);
								}),
							small,
							l));
				case 2:
					var f = large.a;
					var s = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceS,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$SplitOuterFrame(f)),
							small,
							s),
						A3(
							$author$project$Generalise$findDifferenceF,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$SplitOuterFrame, x, s);
								}),
							small,
							f));
				case 1:
					var f = large.a;
					var s = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceS,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$SplitInnerSquare(f)),
							small,
							s),
						A3(
							$author$project$Generalise$findDifferenceF,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$SplitInnerSquare, x, s);
								}),
							small,
							f));
				default:
					var t1 = large.a;
					var t2 = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceT,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$SplitDiaS(t1)),
							small,
							t2),
						A3(
							$author$project$Generalise$findDifferenceT,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$SplitDiaS, x, t2);
								}),
							small,
							t1));
			}
		}
	});
var $author$project$Generalise$findDifferenceT = F3(
	function (diff, small, large) {
		if (A2(
			$author$project$Generalise$ptEq,
			small,
			$author$project$Generalise$TOp(large))) {
			return $elm$core$Maybe$Just(
				diff($author$project$Generalise$RecurseT));
		} else {
			switch (large.$) {
				case 3:
					return $elm$core$Maybe$Nothing;
				case 4:
					return $elm$core$Maybe$Nothing;
				case 5:
					return $elm$core$Maybe$Nothing;
				case 6:
					return $elm$core$Maybe$Nothing;
				case 0:
					var t1 = large.a;
					var s = large.b;
					var t2 = large.c;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceT,
							A2(
								$elm$core$Basics$composeL,
								diff,
								A2($author$project$Generalise$SplitTST, t1, s)),
							small,
							t2),
						A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$findDifferenceS,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A3($author$project$Generalise$SplitTST, t1, x, t2);
									}),
								small,
								s),
							A3(
								$author$project$Generalise$findDifferenceT,
								A2(
									$elm$core$Basics$composeL,
									diff,
									function (x) {
										return A3($author$project$Generalise$SplitTST, x, s, t2);
									}),
								small,
								t1)));
				case 1:
					var l = large.a;
					var t = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceT,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$LCutT(l)),
							small,
							t),
						A3(
							$author$project$Generalise$findDifferenceL,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$LCutT, x, t);
								}),
							small,
							l));
				default:
					var r = large.a;
					var t = large.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$findDifferenceT,
							A2(
								$elm$core$Basics$composeL,
								diff,
								$author$project$Generalise$SplitSide(r)),
							small,
							t),
						A3(
							$author$project$Generalise$findDifferenceR,
							A2(
								$elm$core$Basics$composeL,
								diff,
								function (x) {
									return A2($author$project$Generalise$SplitSide, x, t);
								}),
							small,
							r));
			}
		}
	});
var $author$project$Generalise$findDifference = F2(
	function (small, large) {
		switch (large.$) {
			case 0:
				var s = large.a;
				return A3($author$project$Generalise$findDifferenceS, $author$project$Generalise$SOp, small, s);
			case 1:
				var r = large.a;
				return A3($author$project$Generalise$findDifferenceR, $author$project$Generalise$ROp, small, r);
			case 3:
				var t = large.a;
				return A3($author$project$Generalise$findDifferenceT, $author$project$Generalise$TOp, small, t);
			case 2:
				var f = large.a;
				return A3($author$project$Generalise$findDifferenceF, $author$project$Generalise$FOp, small, f);
			default:
				var l = large.a;
				return A3($author$project$Generalise$findDifferenceL, $author$project$Generalise$LOp, small, l);
		}
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $author$project$Generalise$findPossibleRepeatPointsF = F5(
	function (pt, fr, ps, base, rest) {
		switch (fr.$) {
			case 0:
				var r1 = fr.a;
				var r2 = fr.b;
				var r3 = fr.c;
				var r4 = fr.d;
				var matches = function () {
					if ((pt.$ === 2) && (!pt.a.$)) {
						var _v34 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseF),
								$author$project$Generalise$FOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch4 = A3($author$project$Generalise$SplitFrame, r1, r2, r3);
				var branch3 = function (x) {
					return A4($author$project$Generalise$SplitFrame, r1, r2, x, r4);
				};
				var branch2 = function (x) {
					return A4($author$project$Generalise$SplitFrame, r1, x, r3, r4);
				};
				var branch1 = function (x) {
					return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsR,
						pt,
						r4,
						branchps(branch4),
						base,
						A2($elm$core$Basics$composeL, rest, branch4)),
					A2(
						$author$project$Generalise$ifFailed,
						A5(
							$author$project$Generalise$findPossibleRepeatPointsR,
							pt,
							r3,
							branchps(branch3),
							base,
							A2($elm$core$Basics$composeL, rest, branch3)),
						A2(
							$author$project$Generalise$ifFailed,
							A5(
								$author$project$Generalise$findPossibleRepeatPointsR,
								pt,
								r2,
								branchps(branch2),
								base,
								A2($elm$core$Basics$composeL, rest, branch2)),
							A5(
								$author$project$Generalise$findPossibleRepeatPointsR,
								pt,
								r1,
								branchps(branch1),
								base,
								A2($elm$core$Basics$composeL, rest, branch1)))));
			case 1:
				return $elm$core$Maybe$Nothing;
			case 4:
				return $elm$core$Maybe$Nothing;
			case 3:
				return $elm$core$Maybe$Nothing;
			default:
				if (base.$ === 2) {
					var f = base.a;
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$apR(f))),
							A2(
								$elm$core$List$cons,
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										rest($author$project$Generalise$RecurseF),
										$author$project$Generalise$FOp)),
								ps)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $author$project$Generalise$findPossibleRepeatPointsL = F5(
	function (pt, ll, ps, base, rest) {
		switch (ll.$) {
			case 0:
				var r = ll.a;
				var l = ll.b;
				var matches = function () {
					if ((pt.$ === 4) && (!pt.a.$)) {
						var _v30 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseL),
								$author$project$Generalise$LOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$SplitEnds(r);
				var branch1 = function (x) {
					return A2($author$project$Generalise$SplitEnds, x, l);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsL,
						pt,
						l,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsR,
						pt,
						r,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 1:
				return $elm$core$Maybe$Nothing;
			case 4:
				return $elm$core$Maybe$Nothing;
			case 3:
				return $elm$core$Maybe$Nothing;
			default:
				if (base.$ === 4) {
					var l = base.a;
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$apR(l))),
							A2(
								$elm$core$List$cons,
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										rest($author$project$Generalise$RecurseL),
										$author$project$Generalise$LOp)),
								ps)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $author$project$Generalise$findPossibleRepeatPointsR = F5(
	function (pt, re, ps, base, rest) {
		findPossibleRepeatPointsR:
		while (true) {
			switch (re.$) {
				case 1:
					var t1 = re.a;
					var t2 = re.b;
					var matches = function () {
						if ((pt.$ === 1) && (pt.a.$ === 1)) {
							var _v22 = pt.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									rest($author$project$Generalise$RecurseR),
									$author$project$Generalise$ROp));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					var branchps = function (x) {
						return A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$composeR(x))),
							A2($elm$core$List$cons, matches, ps));
					};
					var branch2 = $author$project$Generalise$SplitDiaR(t1);
					var branch1 = function (x) {
						return A2($author$project$Generalise$SplitDiaR, x, t2);
					};
					return A2(
						$author$project$Generalise$ifFailed,
						A5(
							$author$project$Generalise$findPossibleRepeatPointsT,
							pt,
							t2,
							branchps(branch2),
							base,
							A2($elm$core$Basics$composeL, rest, branch2)),
						A5(
							$author$project$Generalise$findPossibleRepeatPointsT,
							pt,
							t1,
							branchps(branch1),
							base,
							A2($elm$core$Basics$composeL, rest, branch1)));
				case 0:
					var s = re.a;
					var r = re.b;
					var matches = function () {
						if ((pt.$ === 1) && (!pt.a.$)) {
							var _v24 = pt.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									rest($author$project$Generalise$RecurseR),
									$author$project$Generalise$ROp));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					var branchps = function (x) {
						return A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$composeR(x))),
							A2($elm$core$List$cons, matches, ps));
					};
					var branch2 = $author$project$Generalise$SplitSquare(s);
					var branch1 = function (x) {
						return A2($author$project$Generalise$SplitSquare, x, r);
					};
					return A2(
						$author$project$Generalise$ifFailed,
						A5(
							$author$project$Generalise$findPossibleRepeatPointsR,
							pt,
							r,
							branchps(branch2),
							base,
							A2($elm$core$Basics$composeL, rest, branch2)),
						A5(
							$author$project$Generalise$findPossibleRepeatPointsS,
							pt,
							s,
							branchps(branch1),
							base,
							A2($elm$core$Basics$composeL, rest, branch1)));
				case 2:
					var s = re.a;
					var matches = function () {
						if ((pt.$ === 1) && (pt.a.$ === 2)) {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									rest($author$project$Generalise$RecurseR),
									$author$project$Generalise$ROp));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					var branchps = function (x) {
						return A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$composeR(x))),
							A2($elm$core$List$cons, matches, ps));
					};
					return A5(
						$author$project$Generalise$findPossibleRepeatPointsS,
						pt,
						s,
						branchps($author$project$Generalise$ToSquare),
						base,
						A2($elm$core$Basics$composeL, rest, $author$project$Generalise$ToSquare));
				case 3:
					var r = re.a;
					var matches = function () {
						if ((pt.$ === 1) && (pt.a.$ === 3)) {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									rest($author$project$Generalise$RecurseR),
									$author$project$Generalise$ROp));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					var branchps = function (x) {
						return A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$composeR(x))),
							A2($elm$core$List$cons, matches, ps));
					};
					var $temp$pt = pt,
						$temp$re = r,
						$temp$ps = branchps($author$project$Generalise$Rotate),
						$temp$base = base,
						$temp$rest = A2($elm$core$Basics$composeL, rest, $author$project$Generalise$Rotate);
					pt = $temp$pt;
					re = $temp$re;
					ps = $temp$ps;
					base = $temp$base;
					rest = $temp$rest;
					continue findPossibleRepeatPointsR;
				case 4:
					return $elm$core$Maybe$Nothing;
				case 7:
					return $elm$core$Maybe$Nothing;
				case 6:
					return $elm$core$Maybe$Nothing;
				default:
					if (base.$ === 1) {
						var r = base.a;
						return $elm$core$Maybe$Just(
							A2(
								$elm$core$List$map,
								$elm$core$Maybe$map(
									$elm$core$Tuple$mapSecond(
										$elm$core$Basics$apR(r))),
								A2(
									$elm$core$List$cons,
									$elm$core$Maybe$Just(
										_Utils_Tuple2(
											rest($author$project$Generalise$RecurseR),
											$author$project$Generalise$ROp)),
									ps)));
					} else {
						return $elm$core$Maybe$Nothing;
					}
			}
		}
	});
var $author$project$Generalise$findPossibleRepeatPointsS = F5(
	function (pt, sq, ps, base, rest) {
		switch (sq.$) {
			case 0:
				var l = sq.a;
				var s = sq.b;
				var matches = function () {
					if ((!pt.$) && (!pt.a.$)) {
						var _v10 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseS),
								$author$project$Generalise$SOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$LCutS(l);
				var branch1 = function (x) {
					return A2($author$project$Generalise$LCutS, x, s);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsS,
						pt,
						s,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsL,
						pt,
						l,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 1:
				var f = sq.a;
				var s = sq.b;
				var matches = function () {
					if ((!pt.$) && (pt.a.$ === 1)) {
						var _v12 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseS),
								$author$project$Generalise$SOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$SplitInnerSquare(f);
				var branch1 = function (x) {
					return A2($author$project$Generalise$SplitInnerSquare, x, s);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsS,
						pt,
						s,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsF,
						pt,
						f,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 2:
				var f = sq.a;
				var s = sq.b;
				var matches = function () {
					if ((!pt.$) && (pt.a.$ === 2)) {
						var _v14 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseS),
								$author$project$Generalise$SOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$SplitOuterFrame(f);
				var branch1 = function (x) {
					return A2($author$project$Generalise$SplitOuterFrame, x, s);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsS,
						pt,
						s,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsF,
						pt,
						f,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 4:
				var t1 = sq.a;
				var t2 = sq.b;
				var matches = function () {
					if ((!pt.$) && (pt.a.$ === 4)) {
						var _v16 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseS),
								$author$project$Generalise$SOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$SplitDiaS(t1);
				var branch1 = function (x) {
					return A2($author$project$Generalise$SplitDiaS, x, t2);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsT,
						pt,
						t2,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsT,
						pt,
						t1,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 3:
				var s1 = sq.a;
				var s2 = sq.b;
				var s3 = sq.c;
				var s4 = sq.d;
				var matches = function () {
					if ((!pt.$) && (pt.a.$ === 3)) {
						var _v18 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseS),
								$author$project$Generalise$SOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch4 = A3($author$project$Generalise$Split4, s1, s2, s3);
				var branch3 = function (x) {
					return A4($author$project$Generalise$Split4, s1, s2, x, s4);
				};
				var branch2 = function (x) {
					return A4($author$project$Generalise$Split4, s1, x, s3, s4);
				};
				var branch1 = function (x) {
					return A4($author$project$Generalise$Split4, x, s2, s3, s4);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsS,
						pt,
						s4,
						branchps(branch4),
						base,
						A2($elm$core$Basics$composeL, rest, branch4)),
					A2(
						$author$project$Generalise$ifFailed,
						A5(
							$author$project$Generalise$findPossibleRepeatPointsS,
							pt,
							s3,
							branchps(branch3),
							base,
							A2($elm$core$Basics$composeL, rest, branch3)),
						A2(
							$author$project$Generalise$ifFailed,
							A5(
								$author$project$Generalise$findPossibleRepeatPointsS,
								pt,
								s2,
								branchps(branch2),
								base,
								A2($elm$core$Basics$composeL, rest, branch2)),
							A5(
								$author$project$Generalise$findPossibleRepeatPointsS,
								pt,
								s1,
								branchps(branch1),
								base,
								A2($elm$core$Basics$composeL, rest, branch1)))));
			case 5:
				return $elm$core$Maybe$Nothing;
			case 8:
				return $elm$core$Maybe$Nothing;
			case 7:
				return $elm$core$Maybe$Nothing;
			default:
				if (!base.$) {
					var s = base.a;
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$apR(s))),
							A2(
								$elm$core$List$cons,
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										rest($author$project$Generalise$RecurseS),
										$author$project$Generalise$SOp)),
								ps)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $author$project$Generalise$findPossibleRepeatPointsT = F5(
	function (pt, tr, ps, base, rest) {
		switch (tr.$) {
			case 1:
				var l = tr.a;
				var t = tr.b;
				var matches = function () {
					if ((pt.$ === 3) && (pt.a.$ === 1)) {
						var _v2 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseT),
								$author$project$Generalise$TOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$LCutT(l);
				var branch1 = function (x) {
					return A2($author$project$Generalise$LCutT, x, t);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsT,
						pt,
						t,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsL,
						pt,
						l,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 2:
				var r = tr.a;
				var t = tr.b;
				var matches = function () {
					if ((pt.$ === 3) && (pt.a.$ === 2)) {
						var _v4 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseT),
								$author$project$Generalise$TOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch2 = $author$project$Generalise$SplitSide(r);
				var branch1 = function (x) {
					return A2($author$project$Generalise$SplitSide, x, t);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsT,
						pt,
						t,
						branchps(branch2),
						base,
						A2($elm$core$Basics$composeL, rest, branch2)),
					A5(
						$author$project$Generalise$findPossibleRepeatPointsR,
						pt,
						r,
						branchps(branch1),
						base,
						A2($elm$core$Basics$composeL, rest, branch1)));
			case 0:
				var t1 = tr.a;
				var s = tr.b;
				var t2 = tr.c;
				var matches = function () {
					if ((pt.$ === 3) && (!pt.a.$)) {
						var _v6 = pt.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								rest($author$project$Generalise$RecurseT),
								$author$project$Generalise$TOp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var branchps = function (x) {
					return A2(
						$elm$core$List$map,
						$elm$core$Maybe$map(
							$elm$core$Tuple$mapSecond(
								$elm$core$Basics$composeR(x))),
						A2($elm$core$List$cons, matches, ps));
				};
				var branch3 = A2($author$project$Generalise$SplitTST, t1, s);
				var branch2 = function (x) {
					return A3($author$project$Generalise$SplitTST, t1, x, t2);
				};
				var branch1 = function (x) {
					return A3($author$project$Generalise$SplitTST, x, s, t2);
				};
				return A2(
					$author$project$Generalise$ifFailed,
					A5(
						$author$project$Generalise$findPossibleRepeatPointsT,
						pt,
						t2,
						branchps(branch3),
						base,
						A2($elm$core$Basics$composeL, rest, branch3)),
					A2(
						$author$project$Generalise$ifFailed,
						A5(
							$author$project$Generalise$findPossibleRepeatPointsS,
							pt,
							s,
							branchps(branch2),
							base,
							A2($elm$core$Basics$composeL, rest, branch2)),
						A5(
							$author$project$Generalise$findPossibleRepeatPointsT,
							pt,
							t1,
							branchps(branch1),
							base,
							A2($elm$core$Basics$composeL, rest, branch1))));
			case 3:
				return $elm$core$Maybe$Nothing;
			case 6:
				return $elm$core$Maybe$Nothing;
			case 5:
				return $elm$core$Maybe$Nothing;
			default:
				if (base.$ === 3) {
					var t = base.a;
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$List$map,
							$elm$core$Maybe$map(
								$elm$core$Tuple$mapSecond(
									$elm$core$Basics$apR(t))),
							A2(
								$elm$core$List$cons,
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										rest($author$project$Generalise$RecurseT),
										$author$project$Generalise$TOp)),
								ps)));
				} else {
					return $elm$core$Maybe$Nothing;
				}
		}
	});
var $author$project$Generalise$findPossibleRepeatPoints = F2(
	function (base, pt) {
		switch (pt.$) {
			case 0:
				var s = pt.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$reverse,
					A5($author$project$Generalise$findPossibleRepeatPointsS, pt, s, _List_Nil, base, $author$project$Generalise$SOp));
			case 1:
				var r = pt.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$reverse,
					A5($author$project$Generalise$findPossibleRepeatPointsR, pt, r, _List_Nil, base, $author$project$Generalise$ROp));
			case 3:
				var t = pt.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$reverse,
					A5($author$project$Generalise$findPossibleRepeatPointsT, pt, t, _List_Nil, base, $author$project$Generalise$TOp));
			case 2:
				var f = pt.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$reverse,
					A5($author$project$Generalise$findPossibleRepeatPointsF, pt, f, _List_Nil, base, $author$project$Generalise$FOp));
			default:
				var l = pt.a;
				return A2(
					$elm$core$Maybe$map,
					$elm$core$List$reverse,
					A5($author$project$Generalise$findPossibleRepeatPointsL, pt, l, _List_Nil, base, $author$project$Generalise$LOp));
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $lynn$elm_arithmetic$Arithmetic$gcd = F2(
	function (a, b) {
		var gcd_ = F2(
			function (x, y) {
				gcd_:
				while (true) {
					if (!y) {
						return x;
					} else {
						var $temp$x = y,
							$temp$y = A2($elm$core$Basics$modBy, y, x);
						x = $temp$x;
						y = $temp$y;
						continue gcd_;
					}
				}
			});
		return A2(
			gcd_,
			$elm$core$Basics$abs(a),
			$elm$core$Basics$abs(b));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $elm_community$maybe_extra$Maybe$Extra$isJust = function (m) {
	if (m.$ === 1) {
		return false;
	} else {
		return true;
	}
};
var $author$project$Generalise$FRepeater = function (a) {
	return {$: 2, a: a};
};
var $author$project$Generalise$LRepeater = function (a) {
	return {$: 4, a: a};
};
var $author$project$Generalise$RRepeater = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$SRepeater = function (a) {
	return {$: 0, a: a};
};
var $author$project$Generalise$TRepeater = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $elm$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						return $elm$core$Maybe$Just(
							A4(func, a, b, c, d));
					}
				}
			}
		}
	});
var $author$project$Generalise$buildRepeatF = F3(
	function (repeater, n, fr) {
		buildRepeatF:
		while (true) {
			switch (fr.$) {
				case 3:
					var ab = fr.a.p;
					var repeat = fr.a.g;
					var tail = fr.a.d;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						var $temp$repeater = $elm$core$Maybe$Just(
							$author$project$Generalise$FRepeater(
								{
									h: a,
									i: b,
									z: $elm$core$Basics$round((a * n) + b),
									g: repeat,
									d: tail
								})),
							$temp$n = n,
							$temp$fr = repeat;
						repeater = $temp$repeater;
						n = $temp$n;
						fr = $temp$fr;
						continue buildRepeatF;
					} else {
						return $elm$core$Maybe$Just(fr);
					}
				case 4:
					if ((!repeater.$) && (repeater.a.$ === 2)) {
						var a = repeater.a.a.h;
						var b = repeater.a.a.i;
						var repeat = repeater.a.a.g;
						var tail = repeater.a.a.d;
						var i = repeater.a.a.z;
						if (i <= 0) {
							return $elm$core$Maybe$Nothing;
						} else {
							if (i === 1) {
								var $temp$repeater = $elm$core$Maybe$Nothing,
									$temp$n = n,
									$temp$fr = tail;
								repeater = $temp$repeater;
								n = $temp$n;
								fr = $temp$fr;
								continue buildRepeatF;
							} else {
								var $temp$repeater = $elm$core$Maybe$Just(
									$author$project$Generalise$FRepeater(
										{h: a, i: b, z: i - 1, g: repeat, d: tail})),
									$temp$n = n,
									$temp$fr = repeat;
								repeater = $temp$repeater;
								n = $temp$n;
								fr = $temp$fr;
								continue buildRepeatF;
							}
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				case 0:
					var r1 = fr.a;
					var r2 = fr.b;
					var r3 = fr.c;
					var r4 = fr.d;
					return A5(
						$elm$core$Maybe$map4,
						$author$project$Generalise$SplitFrame,
						A3($author$project$Generalise$buildRepeatR, repeater, n, r1),
						A3($author$project$Generalise$buildRepeatR, repeater, n, r2),
						A3($author$project$Generalise$buildRepeatR, repeater, n, r3),
						A3($author$project$Generalise$buildRepeatR, repeater, n, r4));
				case 1:
					var x = fr.a;
					var y = fr.b;
					return $elm$core$Maybe$Just(
						A2($author$project$Generalise$Frame, x, y));
				default:
					return $elm$core$Maybe$Just($author$project$Generalise$RecurseF);
			}
		}
	});
var $author$project$Generalise$buildRepeatL = F3(
	function (repeater, n, ll) {
		buildRepeatL:
		while (true) {
			switch (ll.$) {
				case 3:
					var ab = ll.a.p;
					var repeat = ll.a.g;
					var tail = ll.a.d;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						var $temp$repeater = $elm$core$Maybe$Just(
							$author$project$Generalise$LRepeater(
								{
									h: a,
									i: b,
									z: $elm$core$Basics$round((a * n) + b),
									g: repeat,
									d: tail
								})),
							$temp$n = n,
							$temp$ll = repeat;
						repeater = $temp$repeater;
						n = $temp$n;
						ll = $temp$ll;
						continue buildRepeatL;
					} else {
						return $elm$core$Maybe$Just(ll);
					}
				case 4:
					if ((!repeater.$) && (repeater.a.$ === 4)) {
						var a = repeater.a.a.h;
						var b = repeater.a.a.i;
						var repeat = repeater.a.a.g;
						var tail = repeater.a.a.d;
						var i = repeater.a.a.z;
						if (i <= 0) {
							return $elm$core$Maybe$Nothing;
						} else {
							if (i === 1) {
								var $temp$repeater = $elm$core$Maybe$Nothing,
									$temp$n = n,
									$temp$ll = tail;
								repeater = $temp$repeater;
								n = $temp$n;
								ll = $temp$ll;
								continue buildRepeatL;
							} else {
								var $temp$repeater = $elm$core$Maybe$Just(
									$author$project$Generalise$LRepeater(
										{h: a, i: b, z: i - 1, g: repeat, d: tail})),
									$temp$n = n,
									$temp$ll = repeat;
								repeater = $temp$repeater;
								n = $temp$n;
								ll = $temp$ll;
								continue buildRepeatL;
							}
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				case 0:
					var r = ll.a;
					var l = ll.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitEnds,
						A3($author$project$Generalise$buildRepeatR, repeater, n, r),
						A3($author$project$Generalise$buildRepeatL, repeater, n, l));
				case 1:
					var x = ll.a;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$L(x));
				default:
					return $elm$core$Maybe$Just($author$project$Generalise$RecurseL);
			}
		}
	});
var $author$project$Generalise$buildRepeatR = F3(
	function (repeater, n, re) {
		buildRepeatR:
		while (true) {
			switch (re.$) {
				case 6:
					var ab = re.a.p;
					var repeat = re.a.g;
					var tail = re.a.d;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						var $temp$repeater = $elm$core$Maybe$Just(
							$author$project$Generalise$RRepeater(
								{
									h: a,
									i: b,
									z: $elm$core$Basics$round((a * n) + b),
									g: repeat,
									d: tail
								})),
							$temp$n = n,
							$temp$re = repeat;
						repeater = $temp$repeater;
						n = $temp$n;
						re = $temp$re;
						continue buildRepeatR;
					} else {
						return $elm$core$Maybe$Just(re);
					}
				case 7:
					if ((!repeater.$) && (repeater.a.$ === 1)) {
						var a = repeater.a.a.h;
						var b = repeater.a.a.i;
						var repeat = repeater.a.a.g;
						var tail = repeater.a.a.d;
						var i = repeater.a.a.z;
						if (i <= 0) {
							return $elm$core$Maybe$Nothing;
						} else {
							if (i === 1) {
								var $temp$repeater = $elm$core$Maybe$Nothing,
									$temp$n = n,
									$temp$re = tail;
								repeater = $temp$repeater;
								n = $temp$n;
								re = $temp$re;
								continue buildRepeatR;
							} else {
								var $temp$repeater = $elm$core$Maybe$Just(
									$author$project$Generalise$RRepeater(
										{h: a, i: b, z: i - 1, g: repeat, d: tail})),
									$temp$n = n,
									$temp$re = repeat;
								repeater = $temp$repeater;
								n = $temp$n;
								re = $temp$re;
								continue buildRepeatR;
							}
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				case 1:
					var t1 = re.a;
					var t2 = re.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitDiaR,
						A3($author$project$Generalise$buildRepeatT, repeater, n, t1),
						A3($author$project$Generalise$buildRepeatT, repeater, n, t2));
				case 0:
					var s = re.a;
					var r = re.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitSquare,
						A3($author$project$Generalise$buildRepeatS, repeater, n, s),
						A3($author$project$Generalise$buildRepeatR, repeater, n, r));
				case 2:
					var s = re.a;
					return A2(
						$elm$core$Maybe$map,
						$author$project$Generalise$ToSquare,
						A3($author$project$Generalise$buildRepeatS, repeater, n, s));
				case 3:
					var r = re.a;
					return A2(
						$elm$core$Maybe$map,
						$author$project$Generalise$Rotate,
						A3($author$project$Generalise$buildRepeatR, repeater, n, r));
				case 4:
					var x = re.a;
					var y = re.b;
					return $elm$core$Maybe$Just(
						A2($author$project$Generalise$Rect, x, y));
				default:
					return $elm$core$Maybe$Just($author$project$Generalise$RecurseR);
			}
		}
	});
var $author$project$Generalise$buildRepeatS = F3(
	function (repeater, n, sq) {
		buildRepeatS:
		while (true) {
			switch (sq.$) {
				case 7:
					var ab = sq.a.p;
					var repeat = sq.a.g;
					var tail = sq.a.d;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						var $temp$repeater = $elm$core$Maybe$Just(
							$author$project$Generalise$SRepeater(
								{
									h: a,
									i: b,
									z: $elm$core$Basics$round((a * n) + b),
									g: repeat,
									d: tail
								})),
							$temp$n = n,
							$temp$sq = repeat;
						repeater = $temp$repeater;
						n = $temp$n;
						sq = $temp$sq;
						continue buildRepeatS;
					} else {
						return $elm$core$Maybe$Just(sq);
					}
				case 8:
					if ((!repeater.$) && (!repeater.a.$)) {
						var a = repeater.a.a.h;
						var b = repeater.a.a.i;
						var repeat = repeater.a.a.g;
						var tail = repeater.a.a.d;
						var i = repeater.a.a.z;
						if (i <= 0) {
							return $elm$core$Maybe$Nothing;
						} else {
							if (i === 1) {
								var $temp$repeater = $elm$core$Maybe$Nothing,
									$temp$n = n,
									$temp$sq = tail;
								repeater = $temp$repeater;
								n = $temp$n;
								sq = $temp$sq;
								continue buildRepeatS;
							} else {
								var $temp$repeater = $elm$core$Maybe$Just(
									$author$project$Generalise$SRepeater(
										{h: a, i: b, z: i - 1, g: repeat, d: tail})),
									$temp$n = n,
									$temp$sq = repeat;
								repeater = $temp$repeater;
								n = $temp$n;
								sq = $temp$sq;
								continue buildRepeatS;
							}
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				case 0:
					var l = sq.a;
					var s = sq.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$LCutS,
						A3($author$project$Generalise$buildRepeatL, repeater, n, l),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s));
				case 2:
					var f = sq.a;
					var s = sq.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitOuterFrame,
						A3($author$project$Generalise$buildRepeatF, repeater, n, f),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s));
				case 1:
					var f = sq.a;
					var s = sq.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitInnerSquare,
						A3($author$project$Generalise$buildRepeatF, repeater, n, f),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s));
				case 4:
					var t1 = sq.a;
					var t2 = sq.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitDiaS,
						A3($author$project$Generalise$buildRepeatT, repeater, n, t1),
						A3($author$project$Generalise$buildRepeatT, repeater, n, t2));
				case 3:
					var s1 = sq.a;
					var s2 = sq.b;
					var s3 = sq.c;
					var s4 = sq.d;
					return A5(
						$elm$core$Maybe$map4,
						$author$project$Generalise$Split4,
						A3($author$project$Generalise$buildRepeatS, repeater, n, s1),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s2),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s3),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s4));
				case 5:
					var x = sq.a;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Square(x));
				default:
					return $elm$core$Maybe$Just($author$project$Generalise$RecurseS);
			}
		}
	});
var $author$project$Generalise$buildRepeatT = F3(
	function (repeater, n, tr) {
		buildRepeatT:
		while (true) {
			switch (tr.$) {
				case 5:
					var ab = tr.a.p;
					var repeat = tr.a.g;
					var tail = tr.a.d;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						var $temp$repeater = $elm$core$Maybe$Just(
							$author$project$Generalise$TRepeater(
								{
									h: a,
									i: b,
									z: $elm$core$Basics$round((a * n) + b),
									g: repeat,
									d: tail
								})),
							$temp$n = n,
							$temp$tr = repeat;
						repeater = $temp$repeater;
						n = $temp$n;
						tr = $temp$tr;
						continue buildRepeatT;
					} else {
						return $elm$core$Maybe$Just(tr);
					}
				case 6:
					if ((!repeater.$) && (repeater.a.$ === 3)) {
						var a = repeater.a.a.h;
						var b = repeater.a.a.i;
						var repeat = repeater.a.a.g;
						var tail = repeater.a.a.d;
						var i = repeater.a.a.z;
						if (i <= 0) {
							return $elm$core$Maybe$Nothing;
						} else {
							if (i === 1) {
								var $temp$repeater = $elm$core$Maybe$Nothing,
									$temp$n = n,
									$temp$tr = tail;
								repeater = $temp$repeater;
								n = $temp$n;
								tr = $temp$tr;
								continue buildRepeatT;
							} else {
								var $temp$repeater = $elm$core$Maybe$Just(
									$author$project$Generalise$TRepeater(
										{h: a, i: b, z: i - 1, g: repeat, d: tail})),
									$temp$n = n,
									$temp$tr = repeat;
								repeater = $temp$repeater;
								n = $temp$n;
								tr = $temp$tr;
								continue buildRepeatT;
							}
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				case 0:
					var t1 = tr.a;
					var s = tr.b;
					var t2 = tr.c;
					return A4(
						$elm$core$Maybe$map3,
						$author$project$Generalise$SplitTST,
						A3($author$project$Generalise$buildRepeatT, repeater, n, t1),
						A3($author$project$Generalise$buildRepeatS, repeater, n, s),
						A3($author$project$Generalise$buildRepeatT, repeater, n, t2));
				case 1:
					var l = tr.a;
					var t = tr.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$LCutT,
						A3($author$project$Generalise$buildRepeatL, repeater, n, l),
						A3($author$project$Generalise$buildRepeatT, repeater, n, t));
				case 2:
					var r = tr.a;
					var t = tr.b;
					return A3(
						$elm$core$Maybe$map2,
						$author$project$Generalise$SplitSide,
						A3($author$project$Generalise$buildRepeatR, repeater, n, r),
						A3($author$project$Generalise$buildRepeatT, repeater, n, t));
				case 3:
					var x = tr.a;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Tri(x));
				default:
					return $elm$core$Maybe$Just($author$project$Generalise$RecurseT);
			}
		}
	});
var $author$project$Generalise$buildRepeat = F2(
	function (n, tree) {
		switch (tree.$) {
			case 0:
				var s = tree.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Generalise$SOp,
					A3($author$project$Generalise$buildRepeatS, $elm$core$Maybe$Nothing, n, s));
			case 1:
				var r = tree.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Generalise$ROp,
					A3($author$project$Generalise$buildRepeatR, $elm$core$Maybe$Nothing, n, r));
			case 3:
				var t = tree.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Generalise$TOp,
					A3($author$project$Generalise$buildRepeatT, $elm$core$Maybe$Nothing, n, t));
			case 2:
				var f = tree.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Generalise$FOp,
					A3($author$project$Generalise$buildRepeatF, $elm$core$Maybe$Nothing, n, f));
			default:
				var l = tree.a;
				return A2(
					$elm$core$Maybe$map,
					$author$project$Generalise$LOp,
					A3($author$project$Generalise$buildRepeatL, $elm$core$Maybe$Nothing, n, l));
		}
	});
var $author$project$Generalise$Diff = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$NoDiff = {$: 0};
var $author$project$Generalise$findLowerDiffF = F2(
	function (fr1, fr2) {
		var _v113 = _Utils_Tuple2(fr1, fr2);
		_v113$3:
		while (true) {
			switch (_v113.a.$) {
				case 0:
					if (!_v113.b.$) {
						var _v114 = _v113.a;
						var r11 = _v114.a;
						var r12 = _v114.b;
						var r13 = _v114.c;
						var r14 = _v114.d;
						var _v115 = _v113.b;
						var r21 = _v115.a;
						var r22 = _v115.b;
						var r23 = _v115.c;
						var r24 = _v115.d;
						var _v116 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffR, r11, r21),
							_Utils_Tuple3(
								A2($author$project$Generalise$findLowerDiffR, r12, r22),
								A2($author$project$Generalise$findLowerDiffR, r13, r23),
								A2($author$project$Generalise$findLowerDiffR, r14, r24)));
						_v116$5:
						while (true) {
							if (!_v116.a.$) {
								if (_v116.a.a.$ === 1) {
									if ((((((!_v116.b.a.$) && (!_v116.b.a.a.$)) && (!_v116.b.b.$)) && (!_v116.b.b.a.$)) && (!_v116.b.c.$)) && (!_v116.b.c.a.$)) {
										var d = _v116.a.a.a;
										var _v117 = _v116.b;
										var _v118 = _v117.a.a;
										var _v119 = _v117.b.a;
										var _v120 = _v117.c.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v116$5;
									}
								} else {
									if (!_v116.b.a.$) {
										if (_v116.b.a.a.$ === 1) {
											if ((((!_v116.b.b.$) && (!_v116.b.b.a.$)) && (!_v116.b.c.$)) && (!_v116.b.c.a.$)) {
												var _v121 = _v116.a.a;
												var _v122 = _v116.b;
												var d = _v122.a.a.a;
												var _v123 = _v122.b.a;
												var _v124 = _v122.c.a;
												return $elm$core$Maybe$Just(
													$author$project$Generalise$Diff(d));
											} else {
												break _v116$5;
											}
										} else {
											if (!_v116.b.b.$) {
												if (_v116.b.b.a.$ === 1) {
													if ((!_v116.b.c.$) && (!_v116.b.c.a.$)) {
														var _v125 = _v116.a.a;
														var _v126 = _v116.b;
														var _v127 = _v126.a.a;
														var d = _v126.b.a.a;
														var _v128 = _v126.c.a;
														return $elm$core$Maybe$Just(
															$author$project$Generalise$Diff(d));
													} else {
														break _v116$5;
													}
												} else {
													if (!_v116.b.c.$) {
														if (_v116.b.c.a.$ === 1) {
															var _v129 = _v116.a.a;
															var _v130 = _v116.b;
															var _v131 = _v130.a.a;
															var _v132 = _v130.b.a;
															var d = _v130.c.a.a;
															return $elm$core$Maybe$Just(
																$author$project$Generalise$Diff(d));
														} else {
															var _v133 = _v116.a.a;
															var _v134 = _v116.b;
															var _v135 = _v134.a.a;
															var _v136 = _v134.b.a;
															var _v137 = _v134.c.a;
															return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
														}
													} else {
														break _v116$5;
													}
												}
											} else {
												break _v116$5;
											}
										}
									} else {
										break _v116$5;
									}
								}
							} else {
								break _v116$5;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v113$3;
					}
				case 1:
					if (_v113.b.$ === 1) {
						var _v138 = _v113.a;
						var _v139 = _v113.b;
						return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
					} else {
						break _v113$3;
					}
				case 4:
					var _v140 = _v113.a;
					var f = _v113.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$FOp(f)));
				default:
					break _v113$3;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$findLowerDiffL = F2(
	function (ll1, ll2) {
		var _v103 = _Utils_Tuple2(ll1, ll2);
		_v103$4:
		while (true) {
			switch (_v103.a.$) {
				case 0:
					if (!_v103.b.$) {
						var _v104 = _v103.a;
						var r1 = _v104.a;
						var l1 = _v104.b;
						var _v105 = _v103.b;
						var r2 = _v105.a;
						var l2 = _v105.b;
						var _v106 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffR, r1, r2),
							A2($author$project$Generalise$findLowerDiffL, l1, l2));
						_v106$3:
						while (true) {
							if (!_v106.a.$) {
								if (_v106.a.a.$ === 1) {
									if ((!_v106.b.$) && (!_v106.b.a.$)) {
										var d = _v106.a.a.a;
										var _v107 = _v106.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v106$3;
									}
								} else {
									if (!_v106.b.$) {
										if (_v106.b.a.$ === 1) {
											var _v108 = _v106.a.a;
											var d = _v106.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v109 = _v106.a.a;
											var _v110 = _v106.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v106$3;
									}
								}
							} else {
								break _v106$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v103$4;
					}
				case 1:
					if (_v103.b.$ === 1) {
						return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
					} else {
						break _v103$4;
					}
				case 4:
					var _v111 = _v103.a;
					var l = _v103.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$LOp(l)));
				case 2:
					var _v112 = _v103.a;
					var l = _v103.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$LOp(l)));
				default:
					break _v103$4;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$findLowerDiffR = F2(
	function (re1, re2) {
		findLowerDiffR:
		while (true) {
			var _v84 = _Utils_Tuple2(re1, re2);
			_v84$7:
			while (true) {
				switch (_v84.a.$) {
					case 0:
						if (!_v84.b.$) {
							var _v85 = _v84.a;
							var s1 = _v85.a;
							var r1 = _v85.b;
							var _v86 = _v84.b;
							var s2 = _v86.a;
							var r2 = _v86.b;
							var _v87 = _Utils_Tuple2(
								A2($author$project$Generalise$findLowerDiffS, s1, s2),
								A2($author$project$Generalise$findLowerDiffR, r1, r2));
							_v87$3:
							while (true) {
								if (!_v87.a.$) {
									if (_v87.a.a.$ === 1) {
										if ((!_v87.b.$) && (!_v87.b.a.$)) {
											var d = _v87.a.a.a;
											var _v88 = _v87.b.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											break _v87$3;
										}
									} else {
										if (!_v87.b.$) {
											if (_v87.b.a.$ === 1) {
												var _v89 = _v87.a.a;
												var d = _v87.b.a.a;
												return $elm$core$Maybe$Just(
													$author$project$Generalise$Diff(d));
											} else {
												var _v90 = _v87.a.a;
												var _v91 = _v87.b.a;
												return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
											}
										} else {
											break _v87$3;
										}
									}
								} else {
									break _v87$3;
								}
							}
							return $elm$core$Maybe$Nothing;
						} else {
							break _v84$7;
						}
					case 1:
						if (_v84.b.$ === 1) {
							var _v92 = _v84.a;
							var t11 = _v92.a;
							var t12 = _v92.b;
							var _v93 = _v84.b;
							var t21 = _v93.a;
							var t22 = _v93.b;
							var _v94 = _Utils_Tuple2(
								A2($author$project$Generalise$findLowerDiffT, t11, t21),
								A2($author$project$Generalise$findLowerDiffT, t12, t22));
							_v94$3:
							while (true) {
								if (!_v94.a.$) {
									if (_v94.a.a.$ === 1) {
										if ((!_v94.b.$) && (!_v94.b.a.$)) {
											var d = _v94.a.a.a;
											var _v95 = _v94.b.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											break _v94$3;
										}
									} else {
										if (!_v94.b.$) {
											if (_v94.b.a.$ === 1) {
												var _v96 = _v94.a.a;
												var d = _v94.b.a.a;
												return $elm$core$Maybe$Just(
													$author$project$Generalise$Diff(d));
											} else {
												var _v97 = _v94.a.a;
												var _v98 = _v94.b.a;
												return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
											}
										} else {
											break _v94$3;
										}
									}
								} else {
									break _v94$3;
								}
							}
							return $elm$core$Maybe$Nothing;
						} else {
							break _v84$7;
						}
					case 2:
						if (_v84.b.$ === 2) {
							var s1 = _v84.a.a;
							var s2 = _v84.b.a;
							return A2($author$project$Generalise$findLowerDiffS, s1, s2);
						} else {
							break _v84$7;
						}
					case 3:
						if (_v84.b.$ === 3) {
							var r1 = _v84.a.a;
							var r2 = _v84.b.a;
							var $temp$re1 = r1,
								$temp$re2 = r2;
							re1 = $temp$re1;
							re2 = $temp$re2;
							continue findLowerDiffR;
						} else {
							break _v84$7;
						}
					case 4:
						if (_v84.b.$ === 4) {
							var _v99 = _v84.a;
							var _v100 = _v84.b;
							return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
						} else {
							break _v84$7;
						}
					case 7:
						var _v101 = _v84.a;
						var r = _v84.b;
						return $elm$core$Maybe$Just(
							$author$project$Generalise$Diff(
								$author$project$Generalise$ROp(r)));
					case 5:
						var _v102 = _v84.a;
						var r = _v84.b;
						return $elm$core$Maybe$Just(
							$author$project$Generalise$Diff(
								$author$project$Generalise$ROp(r)));
					default:
						break _v84$7;
				}
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$findLowerDiffS = F2(
	function (ss1, ss2) {
		var _v29 = _Utils_Tuple2(ss1, ss2);
		_v29$8:
		while (true) {
			switch (_v29.a.$) {
				case 0:
					if (!_v29.b.$) {
						var _v30 = _v29.a;
						var l1 = _v30.a;
						var s1 = _v30.b;
						var _v31 = _v29.b;
						var l2 = _v31.a;
						var s2 = _v31.b;
						var _v32 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffL, l1, l2),
							A2($author$project$Generalise$findLowerDiffS, s1, s2));
						_v32$3:
						while (true) {
							if (!_v32.a.$) {
								if (_v32.a.a.$ === 1) {
									if ((!_v32.b.$) && (!_v32.b.a.$)) {
										var d = _v32.a.a.a;
										var _v33 = _v32.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v32$3;
									}
								} else {
									if (!_v32.b.$) {
										if (_v32.b.a.$ === 1) {
											var _v34 = _v32.a.a;
											var d = _v32.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v35 = _v32.a.a;
											var _v36 = _v32.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v32$3;
									}
								}
							} else {
								break _v32$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v29$8;
					}
				case 1:
					if (_v29.b.$ === 1) {
						var _v37 = _v29.a;
						var f1 = _v37.a;
						var s1 = _v37.b;
						var _v38 = _v29.b;
						var f2 = _v38.a;
						var s2 = _v38.b;
						var _v39 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffF, f1, f2),
							A2($author$project$Generalise$findLowerDiffS, s1, s2));
						_v39$3:
						while (true) {
							if (!_v39.a.$) {
								if (_v39.a.a.$ === 1) {
									if ((!_v39.b.$) && (!_v39.b.a.$)) {
										var d = _v39.a.a.a;
										var _v40 = _v39.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v39$3;
									}
								} else {
									if (!_v39.b.$) {
										if (_v39.b.a.$ === 1) {
											var _v41 = _v39.a.a;
											var d = _v39.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v42 = _v39.a.a;
											var _v43 = _v39.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v39$3;
									}
								}
							} else {
								break _v39$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v29$8;
					}
				case 2:
					if (_v29.b.$ === 2) {
						var _v44 = _v29.a;
						var f1 = _v44.a;
						var s1 = _v44.b;
						var _v45 = _v29.b;
						var f2 = _v45.a;
						var s2 = _v45.b;
						var _v46 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffF, f1, f2),
							A2($author$project$Generalise$findLowerDiffS, s1, s2));
						_v46$3:
						while (true) {
							if (!_v46.a.$) {
								if (_v46.a.a.$ === 1) {
									if ((!_v46.b.$) && (!_v46.b.a.$)) {
										var d = _v46.a.a.a;
										var _v47 = _v46.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v46$3;
									}
								} else {
									if (!_v46.b.$) {
										if (_v46.b.a.$ === 1) {
											var _v48 = _v46.a.a;
											var d = _v46.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v49 = _v46.a.a;
											var _v50 = _v46.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v46$3;
									}
								}
							} else {
								break _v46$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v29$8;
					}
				case 3:
					if (_v29.b.$ === 3) {
						var _v51 = _v29.a;
						var s11 = _v51.a;
						var s12 = _v51.b;
						var s13 = _v51.c;
						var s14 = _v51.d;
						var _v52 = _v29.b;
						var s21 = _v52.a;
						var s22 = _v52.b;
						var s23 = _v52.c;
						var s24 = _v52.d;
						var _v53 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffS, s11, s21),
							_Utils_Tuple3(
								A2($author$project$Generalise$findLowerDiffS, s12, s22),
								A2($author$project$Generalise$findLowerDiffS, s13, s23),
								A2($author$project$Generalise$findLowerDiffS, s14, s24)));
						_v53$5:
						while (true) {
							if (!_v53.a.$) {
								if (_v53.a.a.$ === 1) {
									if ((((((!_v53.b.a.$) && (!_v53.b.a.a.$)) && (!_v53.b.b.$)) && (!_v53.b.b.a.$)) && (!_v53.b.c.$)) && (!_v53.b.c.a.$)) {
										var d = _v53.a.a.a;
										var _v54 = _v53.b;
										var _v55 = _v54.a.a;
										var _v56 = _v54.b.a;
										var _v57 = _v54.c.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v53$5;
									}
								} else {
									if (!_v53.b.a.$) {
										if (_v53.b.a.a.$ === 1) {
											if ((((!_v53.b.b.$) && (!_v53.b.b.a.$)) && (!_v53.b.c.$)) && (!_v53.b.c.a.$)) {
												var _v58 = _v53.a.a;
												var _v59 = _v53.b;
												var d = _v59.a.a.a;
												var _v60 = _v59.b.a;
												var _v61 = _v59.c.a;
												return $elm$core$Maybe$Just(
													$author$project$Generalise$Diff(d));
											} else {
												break _v53$5;
											}
										} else {
											if (!_v53.b.b.$) {
												if (_v53.b.b.a.$ === 1) {
													if ((!_v53.b.c.$) && (!_v53.b.c.a.$)) {
														var _v62 = _v53.a.a;
														var _v63 = _v53.b;
														var _v64 = _v63.a.a;
														var d = _v63.b.a.a;
														var _v65 = _v63.c.a;
														return $elm$core$Maybe$Just(
															$author$project$Generalise$Diff(d));
													} else {
														break _v53$5;
													}
												} else {
													if (!_v53.b.c.$) {
														if (_v53.b.c.a.$ === 1) {
															var _v66 = _v53.a.a;
															var _v67 = _v53.b;
															var _v68 = _v67.a.a;
															var _v69 = _v67.b.a;
															var d = _v67.c.a.a;
															return $elm$core$Maybe$Just(
																$author$project$Generalise$Diff(d));
														} else {
															var _v70 = _v53.a.a;
															var _v71 = _v53.b;
															var _v72 = _v71.a.a;
															var _v73 = _v71.b.a;
															var _v74 = _v71.c.a;
															return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
														}
													} else {
														break _v53$5;
													}
												}
											} else {
												break _v53$5;
											}
										}
									} else {
										break _v53$5;
									}
								}
							} else {
								break _v53$5;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v29$8;
					}
				case 4:
					if (_v29.b.$ === 4) {
						var _v75 = _v29.a;
						var t11 = _v75.a;
						var t12 = _v75.b;
						var _v76 = _v29.b;
						var t21 = _v76.a;
						var t22 = _v76.b;
						var _v77 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffT, t11, t21),
							A2($author$project$Generalise$findLowerDiffT, t12, t22));
						_v77$3:
						while (true) {
							if (!_v77.a.$) {
								if (_v77.a.a.$ === 1) {
									if ((!_v77.b.$) && (!_v77.b.a.$)) {
										var d = _v77.a.a.a;
										var _v78 = _v77.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v77$3;
									}
								} else {
									if (!_v77.b.$) {
										if (_v77.b.a.$ === 1) {
											var _v79 = _v77.a.a;
											var d = _v77.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v80 = _v77.a.a;
											var _v81 = _v77.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v77$3;
									}
								}
							} else {
								break _v77$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v29$8;
					}
				case 5:
					if (_v29.b.$ === 5) {
						return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
					} else {
						break _v29$8;
					}
				case 8:
					var _v82 = _v29.a;
					var s = _v29.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$SOp(s)));
				case 6:
					var _v83 = _v29.a;
					var s = _v29.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$SOp(s)));
				default:
					break _v29$8;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$findLowerDiffT = F2(
	function (tr1, tr2) {
		var _v0 = _Utils_Tuple2(tr1, tr2);
		_v0$6:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var _v1 = _v0.a;
						var t11 = _v1.a;
						var s1 = _v1.b;
						var t12 = _v1.c;
						var _v2 = _v0.b;
						var t21 = _v2.a;
						var s2 = _v2.b;
						var t22 = _v2.c;
						var _v3 = _Utils_Tuple3(
							A2($author$project$Generalise$findLowerDiffT, t11, t21),
							A2($author$project$Generalise$findLowerDiffS, s1, s2),
							A2($author$project$Generalise$findLowerDiffT, t12, t22));
						_v3$4:
						while (true) {
							if (!_v3.a.$) {
								if (_v3.a.a.$ === 1) {
									if ((((!_v3.b.$) && (!_v3.b.a.$)) && (!_v3.c.$)) && (!_v3.c.a.$)) {
										var d = _v3.a.a.a;
										var _v4 = _v3.b.a;
										var _v5 = _v3.c.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v3$4;
									}
								} else {
									if (!_v3.b.$) {
										if (_v3.b.a.$ === 1) {
											if ((!_v3.c.$) && (!_v3.c.a.$)) {
												var _v6 = _v3.a.a;
												var d = _v3.b.a.a;
												var _v7 = _v3.c.a;
												return $elm$core$Maybe$Just(
													$author$project$Generalise$Diff(d));
											} else {
												break _v3$4;
											}
										} else {
											if (!_v3.c.$) {
												if (_v3.c.a.$ === 1) {
													var _v8 = _v3.a.a;
													var _v9 = _v3.b.a;
													var d = _v3.c.a.a;
													return $elm$core$Maybe$Just(
														$author$project$Generalise$Diff(d));
												} else {
													var _v10 = _v3.a.a;
													var _v11 = _v3.b.a;
													var _v12 = _v3.c.a;
													return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
												}
											} else {
												break _v3$4;
											}
										}
									} else {
										break _v3$4;
									}
								}
							} else {
								break _v3$4;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v0$6;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var _v13 = _v0.a;
						var l1 = _v13.a;
						var t1 = _v13.b;
						var _v14 = _v0.b;
						var l2 = _v14.a;
						var t2 = _v14.b;
						var _v15 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffL, l1, l2),
							A2($author$project$Generalise$findLowerDiffT, t1, t2));
						_v15$3:
						while (true) {
							if (!_v15.a.$) {
								if (_v15.a.a.$ === 1) {
									if ((!_v15.b.$) && (!_v15.b.a.$)) {
										var d = _v15.a.a.a;
										var _v16 = _v15.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v15$3;
									}
								} else {
									if (!_v15.b.$) {
										if (_v15.b.a.$ === 1) {
											var _v17 = _v15.a.a;
											var d = _v15.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v18 = _v15.a.a;
											var _v19 = _v15.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v15$3;
									}
								}
							} else {
								break _v15$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v0$6;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var _v20 = _v0.a;
						var r1 = _v20.a;
						var t1 = _v20.b;
						var _v21 = _v0.b;
						var r2 = _v21.a;
						var t2 = _v21.b;
						var _v22 = _Utils_Tuple2(
							A2($author$project$Generalise$findLowerDiffR, r1, r2),
							A2($author$project$Generalise$findLowerDiffT, t1, t2));
						_v22$3:
						while (true) {
							if (!_v22.a.$) {
								if (_v22.a.a.$ === 1) {
									if ((!_v22.b.$) && (!_v22.b.a.$)) {
										var d = _v22.a.a.a;
										var _v23 = _v22.b.a;
										return $elm$core$Maybe$Just(
											$author$project$Generalise$Diff(d));
									} else {
										break _v22$3;
									}
								} else {
									if (!_v22.b.$) {
										if (_v22.b.a.$ === 1) {
											var _v24 = _v22.a.a;
											var d = _v22.b.a.a;
											return $elm$core$Maybe$Just(
												$author$project$Generalise$Diff(d));
										} else {
											var _v25 = _v22.a.a;
											var _v26 = _v22.b.a;
											return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
										}
									} else {
										break _v22$3;
									}
								}
							} else {
								break _v22$3;
							}
						}
						return $elm$core$Maybe$Nothing;
					} else {
						break _v0$6;
					}
				case 3:
					if (_v0.b.$ === 3) {
						return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
					} else {
						break _v0$6;
					}
				case 6:
					var _v27 = _v0.a;
					var t = _v0.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$TOp(t)));
				case 4:
					var _v28 = _v0.a;
					var t = _v0.b;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(
							$author$project$Generalise$TOp(t)));
				default:
					break _v0$6;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$findBase = F3(
	function (step, n, base) {
		var _v0 = _Utils_Tuple2(
			A2($author$project$Generalise$buildRepeat, n, step),
			base);
		_v0$5:
		while (true) {
			if (!_v0.a.$) {
				switch (_v0.a.a.$) {
					case 0:
						if (!_v0.b.$) {
							var s1 = _v0.a.a.a;
							var s2 = _v0.b.a;
							var _v1 = A2($author$project$Generalise$findLowerDiffS, s1, s2);
							if (!_v1.$) {
								if (_v1.a.$ === 1) {
									var p = _v1.a.a;
									return A2(
										$author$project$Generalise$ifFailed,
										$elm$core$Maybe$Just(p),
										A3($author$project$Generalise$findBase, step, n - 1, p));
								} else {
									var _v2 = _v1.a;
									return $elm$core$Maybe$Just(
										$author$project$Generalise$SOp(
											$author$project$Generalise$Square(0)));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$5;
						}
					case 1:
						if (_v0.b.$ === 1) {
							var r1 = _v0.a.a.a;
							var r2 = _v0.b.a;
							var _v3 = A2($author$project$Generalise$findLowerDiffR, r1, r2);
							if (!_v3.$) {
								if (_v3.a.$ === 1) {
									var p = _v3.a.a;
									return A2(
										$author$project$Generalise$ifFailed,
										$elm$core$Maybe$Just(p),
										A3($author$project$Generalise$findBase, step, n - 1, p));
								} else {
									var _v4 = _v3.a;
									return $elm$core$Maybe$Just(
										$author$project$Generalise$ROp(
											A2($author$project$Generalise$Rect, 0, 0)));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$5;
						}
					case 2:
						if (_v0.b.$ === 2) {
							var f1 = _v0.a.a.a;
							var f2 = _v0.b.a;
							var _v5 = A2($author$project$Generalise$findLowerDiffF, f1, f2);
							if (!_v5.$) {
								if (_v5.a.$ === 1) {
									var p = _v5.a.a;
									return A2(
										$author$project$Generalise$ifFailed,
										$elm$core$Maybe$Just(p),
										A3($author$project$Generalise$findBase, step, n - 1, p));
								} else {
									var _v6 = _v5.a;
									return $elm$core$Maybe$Just(
										$author$project$Generalise$FOp(
											A2($author$project$Generalise$Frame, 0, 0)));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$5;
						}
					case 3:
						if (_v0.b.$ === 3) {
							var t1 = _v0.a.a.a;
							var t2 = _v0.b.a;
							var _v7 = A2($author$project$Generalise$findLowerDiffT, t1, t2);
							if (!_v7.$) {
								if (_v7.a.$ === 1) {
									var p = _v7.a.a;
									return A2(
										$author$project$Generalise$ifFailed,
										$elm$core$Maybe$Just(p),
										A3($author$project$Generalise$findBase, step, n - 1, p));
								} else {
									var _v8 = _v7.a;
									return $elm$core$Maybe$Just(
										$author$project$Generalise$TOp(
											$author$project$Generalise$Tri(0)));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$5;
						}
					default:
						if (_v0.b.$ === 4) {
							var l1 = _v0.a.a.a;
							var l2 = _v0.b.a;
							var _v9 = A2($author$project$Generalise$findLowerDiffL, l1, l2);
							if (!_v9.$) {
								if (_v9.a.$ === 1) {
									var p = _v9.a.a;
									return A2(
										$author$project$Generalise$ifFailed,
										$elm$core$Maybe$Just(p),
										A3($author$project$Generalise$findBase, step, n - 1, p));
								} else {
									var _v10 = _v9.a;
									return $elm$core$Maybe$Just(
										$author$project$Generalise$LOp(
											$author$project$Generalise$L(0)));
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							break _v0$5;
						}
				}
			} else {
				break _v0$5;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$NextF = {$: 4};
var $author$project$Generalise$NextL = {$: 4};
var $author$project$Generalise$NextR = {$: 7};
var $author$project$Generalise$NextS = {$: 8};
var $author$project$Generalise$NextT = {$: 6};
var $author$project$Generalise$RepeatF = function (a) {
	return {$: 3, a: a};
};
var $author$project$Generalise$RepeatL = function (a) {
	return {$: 3, a: a};
};
var $author$project$Generalise$RepeatR = function (a) {
	return {$: 6, a: a};
};
var $author$project$Generalise$RepeatS = function (a) {
	return {$: 7, a: a};
};
var $author$project$Generalise$RepeatT = function (a) {
	return {$: 5, a: a};
};
var $author$project$Generalise$aN = F6(
	function (_v0, _v1, _v2, _v3, _v4, _v5) {
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$Unsolved = function (a) {
	return {$: 1, a: a};
};
var $author$project$Generalise$applyN = F3(
	function (n, f, b) {
		return (!n) ? b : f(
			A3($author$project$Generalise$applyN, n - 1, f, b));
	});
var $author$project$Generalise$Solved = function (a) {
	return {$: 0, a: a};
};
var $author$project$Generalise$repeatFuncF = F3(
	function (rest, fr, conv) {
		switch (fr.$) {
			case 0:
				var r1 = fr.a;
				var r2 = fr.b;
				var r3 = fr.c;
				var r4 = fr.d;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncR,
						A2(
							$elm$core$Basics$composeL,
							rest,
							A3($author$project$Generalise$SplitFrame, r1, r2, r3)),
						r4,
						conv),
					A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$repeatFuncR,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A4($author$project$Generalise$SplitFrame, r1, r2, x, r4);
								}),
							r3,
							conv),
						A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$repeatFuncR,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, r1, x, r3, r4);
									}),
								r2,
								conv),
							A3(
								$author$project$Generalise$repeatFuncR,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
									}),
								r1,
								conv))));
			case 4:
				return conv.q(rest);
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$repeatFuncL = F3(
	function (rest, ll, conv) {
		switch (ll.$) {
			case 0:
				var r = ll.a;
				var l = ll.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncL,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitEnds(r)),
						l,
						conv),
					A3(
						$author$project$Generalise$repeatFuncR,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitEnds, x, l);
							}),
						r,
						conv));
			case 4:
				return conv.r(rest);
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$repeatFuncR = F3(
	function (rest, re, conv) {
		repeatFuncR:
		while (true) {
			switch (re.$) {
				case 0:
					var s = re.a;
					var r = re.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$repeatFuncR,
							A2(
								$elm$core$Basics$composeL,
								rest,
								$author$project$Generalise$SplitSquare(s)),
							r,
							conv),
						A3(
							$author$project$Generalise$repeatFuncS,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A2($author$project$Generalise$SplitSquare, x, r);
								}),
							s,
							conv));
				case 1:
					var t1 = re.a;
					var t2 = re.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$repeatFuncT,
							A2(
								$elm$core$Basics$composeL,
								rest,
								$author$project$Generalise$SplitDiaR(t1)),
							t2,
							conv),
						A3(
							$author$project$Generalise$repeatFuncT,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A2($author$project$Generalise$SplitDiaR, x, t2);
								}),
							t1,
							conv));
				case 2:
					var s = re.a;
					return A3(
						$author$project$Generalise$repeatFuncS,
						A2($elm$core$Basics$composeL, rest, $author$project$Generalise$ToSquare),
						s,
						conv);
				case 3:
					var r = re.a;
					var $temp$rest = A2($elm$core$Basics$composeL, rest, $author$project$Generalise$Rotate),
						$temp$re = r,
						$temp$conv = conv;
					rest = $temp$rest;
					re = $temp$re;
					conv = $temp$conv;
					continue repeatFuncR;
				case 7:
					return conv.s(rest);
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Generalise$repeatFuncS = F3(
	function (rest, ss, conv) {
		switch (ss.$) {
			case 0:
				var l = ss.a;
				var s = ss.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncS,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutS(l)),
						s,
						conv),
					A3(
						$author$project$Generalise$repeatFuncL,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutS, x, s);
							}),
						l,
						conv));
			case 1:
				var f = ss.a;
				var s = ss.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncS,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitInnerSquare(f)),
						s,
						conv),
					A3(
						$author$project$Generalise$repeatFuncF,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitInnerSquare, x, s);
							}),
						f,
						conv));
			case 2:
				var f = ss.a;
				var s = ss.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncS,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitOuterFrame(f)),
						s,
						conv),
					A3(
						$author$project$Generalise$repeatFuncF,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitOuterFrame, x, s);
							}),
						f,
						conv));
			case 3:
				var s1 = ss.a;
				var s2 = ss.b;
				var s3 = ss.c;
				var s4 = ss.d;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncS,
						A2(
							$elm$core$Basics$composeL,
							rest,
							A3($author$project$Generalise$Split4, s1, s2, s3)),
						s4,
						conv),
					A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$repeatFuncS,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A4($author$project$Generalise$Split4, s1, s2, x, s4);
								}),
							s3,
							conv),
						A2(
							$author$project$Generalise$ifFailed,
							A3(
								$author$project$Generalise$repeatFuncS,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$Split4, s1, x, s3, s4);
									}),
								s2,
								conv),
							A3(
								$author$project$Generalise$repeatFuncS,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$Split4, x, s2, s3, s4);
									}),
								s1,
								conv))));
			case 4:
				var t1 = ss.a;
				var t2 = ss.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncT,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitDiaS(t1)),
						t2,
						conv),
					A3(
						$author$project$Generalise$repeatFuncT,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitDiaS, x, t2);
							}),
						t1,
						conv));
			case 8:
				return conv.t(rest);
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$repeatFuncT = F3(
	function (rest, tr, conv) {
		switch (tr.$) {
			case 0:
				var t1 = tr.a;
				var s = tr.b;
				var t2 = tr.c;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncT,
						A2(
							$elm$core$Basics$composeL,
							rest,
							A2($author$project$Generalise$SplitTST, t1, s)),
						t2,
						conv),
					A2(
						$author$project$Generalise$ifFailed,
						A3(
							$author$project$Generalise$repeatFuncS,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A3($author$project$Generalise$SplitTST, t1, x, t2);
								}),
							s,
							conv),
						A3(
							$author$project$Generalise$repeatFuncT,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A3($author$project$Generalise$SplitTST, x, s, t2);
								}),
							t1,
							conv)));
			case 1:
				var l = tr.a;
				var t = tr.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncT,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutT(l)),
						t,
						conv),
					A3(
						$author$project$Generalise$repeatFuncL,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutT, x, t);
							}),
						l,
						conv));
			case 2:
				var r = tr.a;
				var t = tr.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A3(
						$author$project$Generalise$repeatFuncT,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitSide(r)),
						t,
						conv),
					A3(
						$author$project$Generalise$repeatFuncR,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitSide, x, t);
							}),
						r,
						conv));
			case 6:
				return conv.u(rest);
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$inferFunctionF = F5(
	function (fr1, largeN, fr2, smallN, conv) {
		var _v52 = _Utils_Tuple2(fr1, fr2);
		_v52$2:
		while (true) {
			switch (_v52.a.$) {
				case 0:
					if (!_v52.b.$) {
						var _v53 = _v52.a;
						var r11 = _v53.a;
						var r12 = _v53.b;
						var r13 = _v53.c;
						var r14 = _v53.d;
						var _v54 = _v52.b;
						var r21 = _v54.a;
						var r22 = _v54.b;
						var r23 = _v54.c;
						var r24 = _v54.d;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionR, r14, largeN, r24, smallN, conv),
							A2(
								$author$project$Generalise$ifFailed,
								A5($author$project$Generalise$inferFunctionR, r13, largeN, r23, smallN, conv),
								A2(
									$author$project$Generalise$ifFailed,
									A5($author$project$Generalise$inferFunctionR, r12, largeN, r22, smallN, conv),
									A5($author$project$Generalise$inferFunctionR, r11, largeN, r21, smallN, conv))));
					} else {
						break _v52$2;
					}
				case 3:
					var ab = _v52.a.a.p;
					var repeat = _v52.a.a.g;
					var tail = _v52.a.a.d;
					var fr = _v52.b;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						return A2(
							$elm$core$Maybe$andThen,
							function (x) {
								return A5($author$project$Generalise$inferFunctionF, x, largeN, fr, smallN, conv);
							},
							A3(
								$author$project$Generalise$buildRepeatF,
								$elm$core$Maybe$Nothing,
								smallN,
								$author$project$Generalise$RepeatF(
									{p: ab, g: repeat, d: tail})));
					} else {
						var n = ab.a;
						var _v56 = A3(
							$author$project$Generalise$repeatFuncF,
							function (x) {
								return x;
							},
							repeat,
							{
								q: $elm$core$Maybe$Just,
								r: function (_v57) {
									return $elm$core$Maybe$Nothing;
								},
								s: function (_v58) {
									return $elm$core$Maybe$Nothing;
								},
								t: function (_v59) {
									return $elm$core$Maybe$Nothing;
								},
								u: function (_v60) {
									return $elm$core$Maybe$Nothing;
								}
							});
						if (!_v56.$) {
							var func = _v56.a;
							var maxApplys = function (m) {
								maxApplys:
								while (true) {
									var _v61 = A2(
										$author$project$Generalise$findLowerDiffF,
										A3($author$project$Generalise$applyN, m, func, $author$project$Generalise$NextF),
										fr2);
									if (!_v61.$) {
										var $temp$m = m + 1;
										m = $temp$m;
										continue maxApplys;
									} else {
										return m - 1;
									}
								}
							};
							var repeatNum = maxApplys(1);
							var a = (n - repeatNum) / (largeN - smallN);
							return conv.q(
								{
									p: $author$project$Generalise$Solved(
										{h: a, i: n - (largeN * a)}),
									g: repeat,
									d: tail
								});
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}
				default:
					break _v52$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$inferFunctionL = F5(
	function (ll1, largeN, ll2, smallN, conv) {
		var _v42 = _Utils_Tuple2(ll1, ll2);
		_v42$2:
		while (true) {
			switch (_v42.a.$) {
				case 0:
					if (!_v42.b.$) {
						var _v43 = _v42.a;
						var r1 = _v43.a;
						var l1 = _v43.b;
						var _v44 = _v42.b;
						var r2 = _v44.a;
						var l2 = _v44.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionL, l1, largeN, l2, smallN, conv),
							A5($author$project$Generalise$inferFunctionR, r1, largeN, r2, smallN, conv));
					} else {
						break _v42$2;
					}
				case 3:
					var ab = _v42.a.a.p;
					var repeat = _v42.a.a.g;
					var tail = _v42.a.a.d;
					var ll = _v42.b;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						return A2(
							$elm$core$Maybe$andThen,
							function (x) {
								return A5($author$project$Generalise$inferFunctionL, x, largeN, ll, smallN, conv);
							},
							A3(
								$author$project$Generalise$buildRepeatL,
								$elm$core$Maybe$Nothing,
								smallN,
								$author$project$Generalise$RepeatL(
									{p: ab, g: repeat, d: tail})));
					} else {
						var n = ab.a;
						var _v46 = A3(
							$author$project$Generalise$repeatFuncL,
							function (x) {
								return x;
							},
							repeat,
							{
								q: function (_v47) {
									return $elm$core$Maybe$Nothing;
								},
								r: $elm$core$Maybe$Just,
								s: function (_v48) {
									return $elm$core$Maybe$Nothing;
								},
								t: function (_v49) {
									return $elm$core$Maybe$Nothing;
								},
								u: function (_v50) {
									return $elm$core$Maybe$Nothing;
								}
							});
						if (!_v46.$) {
							var func = _v46.a;
							var maxApplys = function (m) {
								maxApplys:
								while (true) {
									var _v51 = A2(
										$author$project$Generalise$findLowerDiffL,
										A3($author$project$Generalise$applyN, m, func, $author$project$Generalise$NextL),
										ll2);
									if (!_v51.$) {
										var $temp$m = m + 1;
										m = $temp$m;
										continue maxApplys;
									} else {
										return m - 1;
									}
								}
							};
							var repeatNum = maxApplys(1);
							var a = (n - repeatNum) / (largeN - smallN);
							return conv.r(
								{
									p: $author$project$Generalise$Solved(
										{h: a, i: n - (largeN * a)}),
									g: repeat,
									d: tail
								});
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}
				default:
					break _v42$2;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$inferFunctionR = F5(
	function (re1, largeN, re2, smallN, conv) {
		inferFunctionR:
		while (true) {
			var _v30 = _Utils_Tuple2(re1, re2);
			_v30$5:
			while (true) {
				switch (_v30.a.$) {
					case 0:
						if (!_v30.b.$) {
							var _v31 = _v30.a;
							var s1 = _v31.a;
							var r1 = _v31.b;
							var _v32 = _v30.b;
							var s2 = _v32.a;
							var r2 = _v32.b;
							return A2(
								$author$project$Generalise$ifFailed,
								A5($author$project$Generalise$inferFunctionR, r1, largeN, r2, smallN, conv),
								A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv));
						} else {
							break _v30$5;
						}
					case 1:
						if (_v30.b.$ === 1) {
							var _v33 = _v30.a;
							var t11 = _v33.a;
							var t12 = _v33.b;
							var _v34 = _v30.b;
							var t21 = _v34.a;
							var t22 = _v34.b;
							return A2(
								$author$project$Generalise$ifFailed,
								A5($author$project$Generalise$inferFunctionT, t12, largeN, t22, smallN, conv),
								A5($author$project$Generalise$inferFunctionT, t11, largeN, t21, smallN, conv));
						} else {
							break _v30$5;
						}
					case 2:
						if (_v30.b.$ === 2) {
							var s1 = _v30.a.a;
							var s2 = _v30.b.a;
							return A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv);
						} else {
							break _v30$5;
						}
					case 3:
						if (_v30.b.$ === 3) {
							var r1 = _v30.a.a;
							var r2 = _v30.b.a;
							var $temp$re1 = r1,
								$temp$largeN = largeN,
								$temp$re2 = r2,
								$temp$smallN = smallN,
								$temp$conv = conv;
							re1 = $temp$re1;
							largeN = $temp$largeN;
							re2 = $temp$re2;
							smallN = $temp$smallN;
							conv = $temp$conv;
							continue inferFunctionR;
						} else {
							break _v30$5;
						}
					case 6:
						var ab = _v30.a.a.p;
						var repeat = _v30.a.a.g;
						var tail = _v30.a.a.d;
						var re = _v30.b;
						if (!ab.$) {
							var a = ab.a.h;
							var b = ab.a.i;
							return A2(
								$elm$core$Maybe$andThen,
								function (x) {
									return A5($author$project$Generalise$inferFunctionR, x, largeN, re, smallN, conv);
								},
								A3(
									$author$project$Generalise$buildRepeatR,
									$elm$core$Maybe$Nothing,
									smallN,
									$author$project$Generalise$RepeatR(
										{p: ab, g: repeat, d: tail})));
						} else {
							var n = ab.a;
							var _v36 = A3(
								$author$project$Generalise$repeatFuncR,
								function (x) {
									return x;
								},
								repeat,
								{
									q: function (_v37) {
										return $elm$core$Maybe$Nothing;
									},
									r: function (_v38) {
										return $elm$core$Maybe$Nothing;
									},
									s: $elm$core$Maybe$Just,
									t: function (_v39) {
										return $elm$core$Maybe$Nothing;
									},
									u: function (_v40) {
										return $elm$core$Maybe$Nothing;
									}
								});
							if (!_v36.$) {
								var func = _v36.a;
								var maxApplys = function (m) {
									maxApplys:
									while (true) {
										var _v41 = A2(
											$author$project$Generalise$findLowerDiffR,
											A3($author$project$Generalise$applyN, m, func, $author$project$Generalise$NextR),
											re2);
										if (!_v41.$) {
											var $temp$m = m + 1;
											m = $temp$m;
											continue maxApplys;
										} else {
											return m - 1;
										}
									}
								};
								var repeatNum = maxApplys(1);
								var a = (n - repeatNum) / (largeN - smallN);
								return conv.s(
									{
										p: $author$project$Generalise$Solved(
											{h: a, i: n - (largeN * a)}),
										g: repeat,
										d: tail
									});
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					default:
						break _v30$5;
				}
			}
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$inferFunctionS = F5(
	function (sq1, largeN, sq2, smallN, conv) {
		var _v14 = _Utils_Tuple2(sq1, sq2);
		_v14$5:
		while (true) {
			switch (_v14.a.$) {
				case 0:
					if (!_v14.b.$) {
						var _v15 = _v14.a;
						var l1 = _v15.a;
						var s1 = _v15.b;
						var _v16 = _v14.b;
						var l2 = _v16.a;
						var s2 = _v16.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv),
							A5($author$project$Generalise$inferFunctionL, l1, largeN, l2, smallN, conv));
					} else {
						break _v14$5;
					}
				case 1:
					if (_v14.b.$ === 1) {
						var _v17 = _v14.a;
						var f1 = _v17.a;
						var s1 = _v17.b;
						var _v18 = _v14.b;
						var f2 = _v18.a;
						var s2 = _v18.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv),
							A5($author$project$Generalise$inferFunctionF, f1, largeN, f2, smallN, conv));
					} else {
						break _v14$5;
					}
				case 2:
					if (_v14.b.$ === 2) {
						var _v19 = _v14.a;
						var f1 = _v19.a;
						var s1 = _v19.b;
						var _v20 = _v14.b;
						var f2 = _v20.a;
						var s2 = _v20.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv),
							A5($author$project$Generalise$inferFunctionF, f1, largeN, f2, smallN, conv));
					} else {
						break _v14$5;
					}
				case 3:
					if (_v14.b.$ === 3) {
						var _v21 = _v14.a;
						var s11 = _v21.a;
						var s12 = _v21.b;
						var s13 = _v21.c;
						var s14 = _v21.d;
						var _v22 = _v14.b;
						var s21 = _v22.a;
						var s22 = _v22.b;
						var s23 = _v22.c;
						var s24 = _v22.d;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionS, s14, largeN, s24, smallN, conv),
							A2(
								$author$project$Generalise$ifFailed,
								A5($author$project$Generalise$inferFunctionS, s13, largeN, s23, smallN, conv),
								A2(
									$author$project$Generalise$ifFailed,
									A5($author$project$Generalise$inferFunctionS, s12, largeN, s22, smallN, conv),
									A5($author$project$Generalise$inferFunctionS, s11, largeN, s21, smallN, conv))));
					} else {
						break _v14$5;
					}
				case 7:
					var ab = _v14.a.a.p;
					var repeat = _v14.a.a.g;
					var tail = _v14.a.a.d;
					var ss = _v14.b;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						return A2(
							$elm$core$Maybe$andThen,
							function (x) {
								return A5($author$project$Generalise$inferFunctionS, x, largeN, ss, smallN, conv);
							},
							A3(
								$author$project$Generalise$buildRepeatS,
								$elm$core$Maybe$Nothing,
								smallN,
								$author$project$Generalise$RepeatS(
									{p: ab, g: repeat, d: tail})));
					} else {
						var n = ab.a;
						var _v24 = A3(
							$author$project$Generalise$repeatFuncS,
							function (x) {
								return x;
							},
							repeat,
							{
								q: function (_v25) {
									return $elm$core$Maybe$Nothing;
								},
								r: function (_v26) {
									return $elm$core$Maybe$Nothing;
								},
								s: function (_v27) {
									return $elm$core$Maybe$Nothing;
								},
								t: $elm$core$Maybe$Just,
								u: function (_v28) {
									return $elm$core$Maybe$Nothing;
								}
							});
						if (!_v24.$) {
							var func = _v24.a;
							var maxApplys = function (m) {
								maxApplys:
								while (true) {
									var _v29 = A2(
										$author$project$Generalise$findLowerDiffS,
										A3($author$project$Generalise$applyN, m, func, $author$project$Generalise$NextS),
										sq2);
									if (!_v29.$) {
										var $temp$m = m + 1;
										m = $temp$m;
										continue maxApplys;
									} else {
										return m - 1;
									}
								}
							};
							var repeatNum = maxApplys(1);
							var a = (n - repeatNum) / (largeN - smallN);
							return conv.t(
								{
									p: $author$project$Generalise$Solved(
										{h: a, i: n - (largeN * a)}),
									g: repeat,
									d: tail
								});
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}
				default:
					break _v14$5;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$inferFunctionT = F5(
	function (tr1, largeN, tr2, smallN, conv) {
		var _v0 = _Utils_Tuple2(tr1, tr2);
		_v0$4:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var _v1 = _v0.a;
						var t11 = _v1.a;
						var s1 = _v1.b;
						var t12 = _v1.c;
						var _v2 = _v0.b;
						var t21 = _v2.a;
						var s2 = _v2.b;
						var t22 = _v2.c;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionT, t12, largeN, t22, smallN, conv),
							A2(
								$author$project$Generalise$ifFailed,
								A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv),
								A5($author$project$Generalise$inferFunctionT, t11, largeN, t21, smallN, conv)));
					} else {
						break _v0$4;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var _v3 = _v0.a;
						var l1 = _v3.a;
						var t1 = _v3.b;
						var _v4 = _v0.b;
						var l2 = _v4.a;
						var t2 = _v4.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionT, t1, largeN, t2, smallN, conv),
							A5($author$project$Generalise$inferFunctionL, l1, largeN, l2, smallN, conv));
					} else {
						break _v0$4;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var _v5 = _v0.a;
						var r1 = _v5.a;
						var t1 = _v5.b;
						var _v6 = _v0.b;
						var r2 = _v6.a;
						var t2 = _v6.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A5($author$project$Generalise$inferFunctionT, t1, largeN, t2, smallN, conv),
							A5($author$project$Generalise$inferFunctionR, r1, largeN, r2, smallN, conv));
					} else {
						break _v0$4;
					}
				case 5:
					var ab = _v0.a.a.p;
					var repeat = _v0.a.a.g;
					var tail = _v0.a.a.d;
					var tr = _v0.b;
					if (!ab.$) {
						var a = ab.a.h;
						var b = ab.a.i;
						return A2(
							$elm$core$Maybe$andThen,
							function (x) {
								return A5($author$project$Generalise$inferFunctionT, x, largeN, tr, smallN, conv);
							},
							A3(
								$author$project$Generalise$buildRepeatT,
								$elm$core$Maybe$Nothing,
								smallN,
								$author$project$Generalise$RepeatT(
									{p: ab, g: repeat, d: tail})));
					} else {
						var n = ab.a;
						var _v8 = A3(
							$author$project$Generalise$repeatFuncT,
							function (x) {
								return x;
							},
							repeat,
							{
								q: function (_v9) {
									return $elm$core$Maybe$Nothing;
								},
								r: function (_v10) {
									return $elm$core$Maybe$Nothing;
								},
								s: function (_v11) {
									return $elm$core$Maybe$Nothing;
								},
								t: function (_v12) {
									return $elm$core$Maybe$Nothing;
								},
								u: $elm$core$Maybe$Just
							});
						if (!_v8.$) {
							var func = _v8.a;
							var maxApplys = function (m) {
								maxApplys:
								while (true) {
									var _v13 = A2(
										$author$project$Generalise$findLowerDiffT,
										A3($author$project$Generalise$applyN, m, func, $author$project$Generalise$NextT),
										tr2);
									if (!_v13.$) {
										var $temp$m = m + 1;
										m = $temp$m;
										continue maxApplys;
									} else {
										return m - 1;
									}
								}
							};
							var repeatNum = maxApplys(1);
							var a = (n - repeatNum) / (largeN - smallN);
							return conv.u(
								{
									p: $author$project$Generalise$Solved(
										{h: a, i: n - (largeN * a)}),
									g: repeat,
									d: tail
								});
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}
				default:
					break _v0$4;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$inferFunction = F5(
	function (large, largeN, small, smallN, conv) {
		var _v0 = _Utils_Tuple2(large, small);
		_v0$5:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var s1 = _v0.a.a;
						var s2 = _v0.b.a;
						return A5($author$project$Generalise$inferFunctionS, s1, largeN, s2, smallN, conv);
					} else {
						break _v0$5;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var r1 = _v0.a.a;
						var r2 = _v0.b.a;
						return A5($author$project$Generalise$inferFunctionR, r1, largeN, r2, smallN, conv);
					} else {
						break _v0$5;
					}
				case 3:
					if (_v0.b.$ === 3) {
						var t1 = _v0.a.a;
						var t2 = _v0.b.a;
						return A5($author$project$Generalise$inferFunctionT, t1, largeN, t2, smallN, conv);
					} else {
						break _v0$5;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var f1 = _v0.a.a;
						var f2 = _v0.b.a;
						return A5($author$project$Generalise$inferFunctionF, f1, largeN, f2, smallN, conv);
					} else {
						break _v0$5;
					}
				default:
					if (_v0.b.$ === 4) {
						var l1 = _v0.a.a;
						var l2 = _v0.b.a;
						return A5($author$project$Generalise$inferFunctionL, l1, largeN, l2, smallN, conv);
					} else {
						break _v0$5;
					}
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Generalise$countOccurances = function (conv) {
	return function (lowerDiffFunc) {
		return function (defaultVal) {
			return function (next) {
				return function (repeat) {
					return function (trial) {
						return function (ss) {
							return function (rest) {
								return function (largeN) {
									return function (small) {
										return function (smallN) {
											if (_Utils_eq(
												trial(next),
												next)) {
												return $elm$core$Maybe$Nothing;
											} else {
												var maxApplys = function (n) {
													var _v0 = A2(
														lowerDiffFunc,
														A3($author$project$Generalise$applyN, n, trial, next),
														ss);
													if (!_v0.$) {
														if (_v0.a.$ === 1) {
															var diff = _v0.a.a;
															return $elm$core$Maybe$Just(
																A2(
																	$elm$core$Maybe$withDefault,
																	_Utils_Tuple2(n, diff),
																	maxApplys(n + 1)));
														} else {
															var _v1 = _v0.a;
															return $elm$core$Maybe$Just(
																_Utils_Tuple2(n, defaultVal));
														}
													} else {
														return $elm$core$Maybe$Nothing;
													}
												};
												var _v2 = maxApplys(1);
												if (!_v2.$) {
													var _v3 = _v2.a;
													var n = _v3.a;
													var tail = _v3.b;
													return A5(
														$author$project$Generalise$inferFunction,
														rest(
															repeat(
																{
																	p: $author$project$Generalise$Unsolved(n + 1),
																	g: trial(next),
																	d: tail
																})),
														largeN,
														small,
														smallN,
														conv);
												} else {
													return $elm$core$Maybe$Nothing;
												}
											}
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Generalise$du = F4(
	function (d, f, s1, s2) {
		var _v0 = A2(d, s1, s2);
		if (!_v0.$) {
			if (_v0.a.$ === 1) {
				var p = _v0.a.a;
				var _v1 = f(p);
				if (!_v1.$) {
					var s = _v1.a;
					return $elm$core$Maybe$Just(
						$author$project$Generalise$Diff(s));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				var _v2 = _v0.a;
				return $elm$core$Maybe$Just($author$project$Generalise$NoDiff);
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$findRepeatF = F7(
	function (trial, fr, rest, largeN, small, smallN, occ) {
		var _v8 = A6(occ.q, trial, fr, rest, largeN, small, smallN);
		if (!_v8.$) {
			var f = _v8.a;
			return $elm$core$Maybe$Just(f);
		} else {
			if (!fr.$) {
				var r1 = fr.a;
				var r2 = fr.b;
				var r3 = fr.c;
				var r4 = fr.d;
				return A2(
					$author$project$Generalise$ifFailed,
					A7(
						$author$project$Generalise$findRepeatR,
						A2(
							$elm$core$Basics$composeL,
							trial,
							A3($author$project$Generalise$SplitFrame, r1, r3, r3)),
						r4,
						rest,
						largeN,
						small,
						smallN,
						occ),
					A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatR,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A4($author$project$Generalise$SplitFrame, r1, r2, x, r4);
								}),
							r3,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A2(
							$author$project$Generalise$ifFailed,
							A7(
								$author$project$Generalise$findRepeatR,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, r1, x, r3, r4);
									}),
								r2,
								rest,
								largeN,
								small,
								smallN,
								occ),
							A7(
								$author$project$Generalise$findRepeatR,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
									}),
								r1,
								rest,
								largeN,
								small,
								smallN,
								occ))));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Generalise$findRepeatL = F7(
	function (trial, ll, rest, largeN, small, smallN, occ) {
		var _v6 = A6(occ.r, trial, ll, rest, largeN, small, smallN);
		if (!_v6.$) {
			var l = _v6.a;
			return $elm$core$Maybe$Just(l);
		} else {
			if (!ll.$) {
				var r = ll.a;
				var l = ll.b;
				return A2(
					$author$project$Generalise$ifFailed,
					A7(
						$author$project$Generalise$findRepeatL,
						A2(
							$elm$core$Basics$composeL,
							trial,
							$author$project$Generalise$SplitEnds(r)),
						l,
						rest,
						largeN,
						small,
						smallN,
						occ),
					A7(
						$author$project$Generalise$findRepeatR,
						A2(
							$elm$core$Basics$composeL,
							trial,
							function (x) {
								return A2($author$project$Generalise$SplitEnds, x, l);
							}),
						r,
						rest,
						largeN,
						small,
						smallN,
						occ));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Generalise$findRepeatR = F7(
	function (trial, re, rest, largeN, small, smallN, occ) {
		findRepeatR:
		while (true) {
			var _v4 = A6(occ.s, trial, re, rest, largeN, small, smallN);
			if (!_v4.$) {
				var r = _v4.a;
				return $elm$core$Maybe$Just(r);
			} else {
				switch (re.$) {
					case 0:
						var s = re.a;
						var r = re.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A7(
								$author$project$Generalise$findRepeatR,
								A2(
									$elm$core$Basics$composeL,
									trial,
									$author$project$Generalise$SplitSquare(s)),
								r,
								rest,
								largeN,
								small,
								smallN,
								occ),
							A7(
								$author$project$Generalise$findRepeatS,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A2($author$project$Generalise$SplitSquare, x, r);
									}),
								s,
								rest,
								largeN,
								small,
								smallN,
								occ));
					case 1:
						var t1 = re.a;
						var t2 = re.b;
						return A2(
							$author$project$Generalise$ifFailed,
							A7(
								$author$project$Generalise$findRepeatT,
								A2(
									$elm$core$Basics$composeL,
									trial,
									$author$project$Generalise$SplitDiaR(t1)),
								t2,
								rest,
								largeN,
								small,
								smallN,
								occ),
							A7(
								$author$project$Generalise$findRepeatT,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A2($author$project$Generalise$SplitDiaR, x, t2);
									}),
								t1,
								rest,
								largeN,
								small,
								smallN,
								occ));
					case 2:
						var s = re.a;
						return A7(
							$author$project$Generalise$findRepeatS,
							A2($elm$core$Basics$composeL, trial, $author$project$Generalise$ToSquare),
							s,
							rest,
							largeN,
							small,
							smallN,
							occ);
					case 3:
						var r = re.a;
						var $temp$trial = A2($elm$core$Basics$composeL, trial, $author$project$Generalise$Rotate),
							$temp$re = r,
							$temp$rest = rest,
							$temp$largeN = largeN,
							$temp$small = small,
							$temp$smallN = smallN,
							$temp$occ = occ;
						trial = $temp$trial;
						re = $temp$re;
						rest = $temp$rest;
						largeN = $temp$largeN;
						small = $temp$small;
						smallN = $temp$smallN;
						occ = $temp$occ;
						continue findRepeatR;
					default:
						return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $author$project$Generalise$findRepeatS = F7(
	function (trial, ss, rest, largeN, small, smallN, occ) {
		var _v2 = A6(occ.t, trial, ss, rest, largeN, small, smallN);
		if (!_v2.$) {
			var s = _v2.a;
			return $elm$core$Maybe$Just(s);
		} else {
			switch (ss.$) {
				case 0:
					var l = ss.a;
					var s = ss.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatS,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$LCutS(l)),
							s,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatL,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$LCutS, x, s);
								}),
							l,
							rest,
							largeN,
							small,
							smallN,
							occ));
				case 1:
					var f = ss.a;
					var s = ss.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatS,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$SplitInnerSquare(f)),
							s,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatF,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$SplitInnerSquare, x, s);
								}),
							f,
							rest,
							largeN,
							small,
							smallN,
							occ));
				case 2:
					var f = ss.a;
					var s = ss.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatS,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$SplitOuterFrame(f)),
							s,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatF,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$SplitOuterFrame, x, s);
								}),
							f,
							rest,
							largeN,
							small,
							smallN,
							occ));
				case 3:
					var s1 = ss.a;
					var s2 = ss.b;
					var s3 = ss.c;
					var s4 = ss.d;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatS,
							A2(
								$elm$core$Basics$composeL,
								trial,
								A3($author$project$Generalise$Split4, s1, s2, s3)),
							s4,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A2(
							$author$project$Generalise$ifFailed,
							A7(
								$author$project$Generalise$findRepeatS,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A4($author$project$Generalise$Split4, s1, s2, x, s4);
									}),
								s3,
								rest,
								largeN,
								small,
								smallN,
								occ),
							A2(
								$author$project$Generalise$ifFailed,
								A7(
									$author$project$Generalise$findRepeatS,
									A2(
										$elm$core$Basics$composeL,
										trial,
										function (x) {
											return A4($author$project$Generalise$Split4, s1, x, s3, s4);
										}),
									s2,
									rest,
									largeN,
									small,
									smallN,
									occ),
								A7(
									$author$project$Generalise$findRepeatS,
									A2(
										$elm$core$Basics$composeL,
										trial,
										function (x) {
											return A4($author$project$Generalise$Split4, x, s2, s3, s4);
										}),
									s1,
									rest,
									largeN,
									small,
									smallN,
									occ))));
				case 4:
					var t1 = ss.a;
					var t2 = ss.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatT,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$SplitDiaS(t1)),
							t2,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatT,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$SplitDiaS, x, t2);
								}),
							t1,
							rest,
							largeN,
							small,
							smallN,
							occ));
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Generalise$findRepeatT = F7(
	function (trial, tr, rest, largeN, small, smallN, occ) {
		var _v0 = A6(occ.u, trial, tr, rest, largeN, small, smallN);
		if (!_v0.$) {
			var t = _v0.a;
			return $elm$core$Maybe$Just(t);
		} else {
			switch (tr.$) {
				case 0:
					var t1 = tr.a;
					var s = tr.b;
					var t2 = tr.c;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatT,
							A2(
								$elm$core$Basics$composeL,
								trial,
								A2($author$project$Generalise$SplitTST, t1, s)),
							t2,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A2(
							$author$project$Generalise$ifFailed,
							A7(
								$author$project$Generalise$findRepeatS,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A3($author$project$Generalise$SplitTST, t1, x, t2);
									}),
								s,
								rest,
								largeN,
								small,
								smallN,
								occ),
							A7(
								$author$project$Generalise$findRepeatT,
								A2(
									$elm$core$Basics$composeL,
									trial,
									function (x) {
										return A3($author$project$Generalise$SplitTST, x, s, t2);
									}),
								t1,
								rest,
								largeN,
								small,
								smallN,
								occ)));
				case 1:
					var l = tr.a;
					var t = tr.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatT,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$LCutT(l)),
							t,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatL,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$LCutT, x, t);
								}),
							l,
							rest,
							largeN,
							small,
							smallN,
							occ));
				case 2:
					var r = tr.a;
					var t = tr.b;
					return A2(
						$author$project$Generalise$ifFailed,
						A7(
							$author$project$Generalise$findRepeatT,
							A2(
								$elm$core$Basics$composeL,
								trial,
								$author$project$Generalise$SplitSide(r)),
							t,
							rest,
							largeN,
							small,
							smallN,
							occ),
						A7(
							$author$project$Generalise$findRepeatR,
							A2(
								$elm$core$Basics$composeL,
								trial,
								function (x) {
									return A2($author$project$Generalise$SplitSide, x, t);
								}),
							r,
							rest,
							largeN,
							small,
							smallN,
							occ));
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Generalise$unwrapF = function (p) {
	if (p.$ === 2) {
		var f = p.a;
		return $elm$core$Maybe$Just(f);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Generalise$unwrapL = function (p) {
	if (p.$ === 4) {
		var l = p.a;
		return $elm$core$Maybe$Just(l);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Generalise$unwrapR = function (p) {
	if (p.$ === 1) {
		var r = p.a;
		return $elm$core$Maybe$Just(r);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Generalise$unwrapS = function (p) {
	if (!p.$) {
		var s = p.a;
		return $elm$core$Maybe$Just(s);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Generalise$unwrapT = function (p) {
	if (p.$ === 3) {
		var t = p.a;
		return $elm$core$Maybe$Just(t);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Generalise$repeatSearchF = F5(
	function (fr, largeN, small, smallN, rest) {
		var _v24 = A7(
			$author$project$Generalise$findRepeatF,
			function (x) {
				return x;
			},
			fr,
			rest,
			largeN,
			small,
			smallN,
			{
				q: A5(
					$author$project$Generalise$countOccurances,
					{
						q: $elm$core$Maybe$Just,
						r: function (_v25) {
							return $elm$core$Maybe$Nothing;
						},
						s: function (_v26) {
							return $elm$core$Maybe$Nothing;
						},
						t: function (_v27) {
							return $elm$core$Maybe$Nothing;
						},
						u: function (_v28) {
							return $elm$core$Maybe$Nothing;
						}
					},
					A2($author$project$Generalise$du, $author$project$Generalise$findLowerDiffF, $author$project$Generalise$unwrapF),
					A2($author$project$Generalise$Frame, 0, 0),
					$author$project$Generalise$NextF,
					$author$project$Generalise$RepeatF),
				r: $author$project$Generalise$aN,
				s: $author$project$Generalise$aN,
				t: $author$project$Generalise$aN,
				u: $author$project$Generalise$aN
			});
		if (!_v24.$) {
			var repeat = _v24.a;
			return $author$project$Generalise$RepeatF(
				_Utils_update(
					repeat,
					{
						d: A5(
							$author$project$Generalise$repeatSearchF,
							repeat.d,
							largeN,
							small,
							smallN,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return $author$project$Generalise$RepeatF(
										_Utils_update(
											repeat,
											{d: x}));
								}))
					}));
		} else {
			if (!fr.$) {
				var r1 = fr.a;
				var r2 = fr.b;
				var r3 = fr.c;
				var r4 = fr.d;
				var r1Repeat = A5(
					$author$project$Generalise$repeatSearchR,
					r1,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						function (x) {
							return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
						}));
				var r2Repeat = A5(
					$author$project$Generalise$repeatSearchR,
					r2,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						function (x) {
							return A4($author$project$Generalise$SplitFrame, r1Repeat, x, r3, r4);
						}));
				var r3Repeat = A5(
					$author$project$Generalise$repeatSearchR,
					r3,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						function (x) {
							return A4($author$project$Generalise$SplitFrame, r1Repeat, r2Repeat, x, r4);
						}));
				var r4Repeat = A5(
					$author$project$Generalise$repeatSearchR,
					r4,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						A3($author$project$Generalise$SplitFrame, r1Repeat, r2Repeat, r3Repeat)));
				return A4($author$project$Generalise$SplitFrame, r1Repeat, r2Repeat, r3Repeat, r4Repeat);
			} else {
				var x = fr;
				return x;
			}
		}
	});
var $author$project$Generalise$repeatSearchL = F5(
	function (ll, largeN, small, smallN, rest) {
		var _v18 = A7(
			$author$project$Generalise$findRepeatL,
			function (x) {
				return x;
			},
			ll,
			rest,
			largeN,
			small,
			smallN,
			{
				q: $author$project$Generalise$aN,
				r: A5(
					$author$project$Generalise$countOccurances,
					{
						q: function (_v19) {
							return $elm$core$Maybe$Nothing;
						},
						r: $elm$core$Maybe$Just,
						s: function (_v20) {
							return $elm$core$Maybe$Nothing;
						},
						t: function (_v21) {
							return $elm$core$Maybe$Nothing;
						},
						u: function (_v22) {
							return $elm$core$Maybe$Nothing;
						}
					},
					A2($author$project$Generalise$du, $author$project$Generalise$findLowerDiffL, $author$project$Generalise$unwrapL),
					$author$project$Generalise$L(0),
					$author$project$Generalise$NextL,
					$author$project$Generalise$RepeatL),
				s: $author$project$Generalise$aN,
				t: $author$project$Generalise$aN,
				u: $author$project$Generalise$aN
			});
		if (!_v18.$) {
			var repeat = _v18.a;
			return $author$project$Generalise$RepeatL(
				_Utils_update(
					repeat,
					{
						d: A5(
							$author$project$Generalise$repeatSearchL,
							repeat.d,
							largeN,
							small,
							smallN,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return $author$project$Generalise$RepeatL(
										_Utils_update(
											repeat,
											{d: x}));
								}))
					}));
		} else {
			if (!ll.$) {
				var r = ll.a;
				var l = ll.b;
				var rRepeat = A5(
					$author$project$Generalise$repeatSearchR,
					r,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						function (x) {
							return A2($author$project$Generalise$SplitEnds, x, l);
						}));
				var lRepeat = A5(
					$author$project$Generalise$repeatSearchL,
					l,
					largeN,
					small,
					smallN,
					A2(
						$elm$core$Basics$composeL,
						rest,
						$author$project$Generalise$SplitEnds(rRepeat)));
				return A2($author$project$Generalise$SplitEnds, rRepeat, lRepeat);
			} else {
				var x = ll;
				return x;
			}
		}
	});
var $author$project$Generalise$repeatSearchR = F5(
	function (re, largeN, small, smallN, rest) {
		var _v12 = A7(
			$author$project$Generalise$findRepeatR,
			function (x) {
				return x;
			},
			re,
			rest,
			largeN,
			small,
			smallN,
			{
				q: $author$project$Generalise$aN,
				r: $author$project$Generalise$aN,
				s: A5(
					$author$project$Generalise$countOccurances,
					{
						q: function (_v13) {
							return $elm$core$Maybe$Nothing;
						},
						r: function (_v14) {
							return $elm$core$Maybe$Nothing;
						},
						s: $elm$core$Maybe$Just,
						t: function (_v15) {
							return $elm$core$Maybe$Nothing;
						},
						u: function (_v16) {
							return $elm$core$Maybe$Nothing;
						}
					},
					A2($author$project$Generalise$du, $author$project$Generalise$findLowerDiffR, $author$project$Generalise$unwrapR),
					A2($author$project$Generalise$Rect, 0, 0),
					$author$project$Generalise$NextR,
					$author$project$Generalise$RepeatR),
				t: $author$project$Generalise$aN,
				u: $author$project$Generalise$aN
			});
		if (!_v12.$) {
			var repeat = _v12.a;
			return $author$project$Generalise$RepeatR(
				_Utils_update(
					repeat,
					{
						d: A5(
							$author$project$Generalise$repeatSearchR,
							repeat.d,
							largeN,
							small,
							smallN,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return $author$project$Generalise$RepeatR(
										_Utils_update(
											repeat,
											{d: x}));
								}))
					}));
		} else {
			switch (re.$) {
				case 0:
					var s = re.a;
					var r = re.b;
					var sRepeat = A5(
						$author$project$Generalise$repeatSearchS,
						s,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitSquare, x, r);
							}));
					var rRepeat = A5(
						$author$project$Generalise$repeatSearchR,
						r,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitSquare(sRepeat)));
					return A2($author$project$Generalise$SplitSquare, sRepeat, rRepeat);
				case 1:
					var t1 = re.a;
					var t2 = re.b;
					var t1Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t1,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitDiaR, x, t2);
							}));
					var t2Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t2,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitDiaR(t1Repeat)));
					return A2($author$project$Generalise$SplitDiaR, t1Repeat, t2Repeat);
				case 2:
					var s = re.a;
					return $author$project$Generalise$ToSquare(
						A5(
							$author$project$Generalise$repeatSearchS,
							s,
							largeN,
							small,
							smallN,
							A2($elm$core$Basics$composeL, rest, $author$project$Generalise$ToSquare)));
				case 3:
					var r = re.a;
					return $author$project$Generalise$Rotate(
						A5(
							$author$project$Generalise$repeatSearchR,
							r,
							largeN,
							small,
							smallN,
							A2($elm$core$Basics$composeL, rest, $author$project$Generalise$Rotate)));
				default:
					var x = re;
					return x;
			}
		}
	});
var $author$project$Generalise$repeatSearchS = F5(
	function (ss, largeN, small, smallN, rest) {
		var _v6 = A7(
			$author$project$Generalise$findRepeatS,
			function (x) {
				return x;
			},
			ss,
			rest,
			largeN,
			small,
			smallN,
			{
				q: $author$project$Generalise$aN,
				r: $author$project$Generalise$aN,
				s: $author$project$Generalise$aN,
				t: A5(
					$author$project$Generalise$countOccurances,
					{
						q: function (_v7) {
							return $elm$core$Maybe$Nothing;
						},
						r: function (_v8) {
							return $elm$core$Maybe$Nothing;
						},
						s: function (_v9) {
							return $elm$core$Maybe$Nothing;
						},
						t: $elm$core$Maybe$Just,
						u: function (_v10) {
							return $elm$core$Maybe$Nothing;
						}
					},
					A2($author$project$Generalise$du, $author$project$Generalise$findLowerDiffS, $author$project$Generalise$unwrapS),
					$author$project$Generalise$Square(0),
					$author$project$Generalise$NextS,
					$author$project$Generalise$RepeatS),
				u: $author$project$Generalise$aN
			});
		if (!_v6.$) {
			var repeat = _v6.a;
			return $author$project$Generalise$RepeatS(
				_Utils_update(
					repeat,
					{
						d: A5(
							$author$project$Generalise$repeatSearchS,
							repeat.d,
							largeN,
							small,
							smallN,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return $author$project$Generalise$RepeatS(
										_Utils_update(
											repeat,
											{d: x}));
								}))
					}));
		} else {
			switch (ss.$) {
				case 0:
					var l = ss.a;
					var s = ss.b;
					var lRepeat = A5(
						$author$project$Generalise$repeatSearchL,
						l,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutS, x, s);
							}));
					var sRepeat = A5(
						$author$project$Generalise$repeatSearchS,
						s,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutS(lRepeat)));
					return A2($author$project$Generalise$LCutS, lRepeat, sRepeat);
				case 1:
					var f = ss.a;
					var s = ss.b;
					var fRepeat = A5(
						$author$project$Generalise$repeatSearchF,
						f,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitInnerSquare, x, s);
							}));
					var sRepeat = A5(
						$author$project$Generalise$repeatSearchS,
						s,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitInnerSquare(fRepeat)));
					return A2($author$project$Generalise$SplitInnerSquare, fRepeat, sRepeat);
				case 2:
					var f = ss.a;
					var s = ss.b;
					var fRepeat = A5(
						$author$project$Generalise$repeatSearchF,
						f,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitOuterFrame, x, s);
							}));
					var sRepeat = A5(
						$author$project$Generalise$repeatSearchS,
						s,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitOuterFrame(fRepeat)));
					return A2($author$project$Generalise$SplitOuterFrame, fRepeat, sRepeat);
				case 3:
					var s1 = ss.a;
					var s2 = ss.b;
					var s3 = ss.c;
					var s4 = ss.d;
					var s1Repeat = A5(
						$author$project$Generalise$repeatSearchS,
						s1,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A4($author$project$Generalise$Split4, x, s2, s3, s4);
							}));
					var s2Repeat = A5(
						$author$project$Generalise$repeatSearchS,
						s2,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A4($author$project$Generalise$Split4, s1Repeat, x, s3, s4);
							}));
					var s3Repeat = A5(
						$author$project$Generalise$repeatSearchS,
						s3,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A4($author$project$Generalise$Split4, s1Repeat, s2Repeat, x, s4);
							}));
					var s4Repeat = A5(
						$author$project$Generalise$repeatSearchS,
						s4,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							A3($author$project$Generalise$Split4, s1Repeat, s2Repeat, s3Repeat)));
					return A4($author$project$Generalise$Split4, s1Repeat, s2Repeat, s3Repeat, s4Repeat);
				case 4:
					var t1 = ss.a;
					var t2 = ss.b;
					var t1Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t1,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitDiaS, x, t2);
							}));
					var t2Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t2,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitDiaS(t1Repeat)));
					return A2($author$project$Generalise$SplitDiaS, t1Repeat, t2Repeat);
				default:
					var x = ss;
					return x;
			}
		}
	});
var $author$project$Generalise$repeatSearchT = F5(
	function (tr, largeN, small, smallN, rest) {
		var _v0 = A7(
			$author$project$Generalise$findRepeatT,
			function (x) {
				return x;
			},
			tr,
			rest,
			largeN,
			small,
			smallN,
			{
				q: $author$project$Generalise$aN,
				r: $author$project$Generalise$aN,
				s: $author$project$Generalise$aN,
				t: $author$project$Generalise$aN,
				u: A5(
					$author$project$Generalise$countOccurances,
					{
						q: function (_v1) {
							return $elm$core$Maybe$Nothing;
						},
						r: function (_v2) {
							return $elm$core$Maybe$Nothing;
						},
						s: function (_v3) {
							return $elm$core$Maybe$Nothing;
						},
						t: function (_v4) {
							return $elm$core$Maybe$Nothing;
						},
						u: $elm$core$Maybe$Just
					},
					A2($author$project$Generalise$du, $author$project$Generalise$findLowerDiffT, $author$project$Generalise$unwrapT),
					$author$project$Generalise$Tri(0),
					$author$project$Generalise$NextT,
					$author$project$Generalise$RepeatT)
			});
		if (!_v0.$) {
			var repeat = _v0.a;
			return $author$project$Generalise$RepeatT(
				_Utils_update(
					repeat,
					{
						d: A5(
							$author$project$Generalise$repeatSearchT,
							repeat.d,
							largeN,
							small,
							smallN,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return $author$project$Generalise$RepeatT(
										_Utils_update(
											repeat,
											{d: x}));
								}))
					}));
		} else {
			switch (tr.$) {
				case 0:
					var t1 = tr.a;
					var s = tr.b;
					var t2 = tr.c;
					var t1Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t1,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A3($author$project$Generalise$SplitTST, x, s, t2);
							}));
					var sRepeat = A5(
						$author$project$Generalise$repeatSearchS,
						s,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A3($author$project$Generalise$SplitTST, t1Repeat, x, t2);
							}));
					var t2Repeat = A5(
						$author$project$Generalise$repeatSearchT,
						t2,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							A2($author$project$Generalise$SplitTST, t1Repeat, sRepeat)));
					return A3($author$project$Generalise$SplitTST, t1Repeat, sRepeat, t2Repeat);
				case 1:
					var l = tr.a;
					var t = tr.b;
					var lRepeat = A5(
						$author$project$Generalise$repeatSearchL,
						l,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutT, x, t);
							}));
					var tRepeat = A5(
						$author$project$Generalise$repeatSearchT,
						t,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutT(lRepeat)));
					return A2($author$project$Generalise$LCutT, lRepeat, tRepeat);
				case 2:
					var r = tr.a;
					var t = tr.b;
					var rRepeat = A5(
						$author$project$Generalise$repeatSearchR,
						r,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitSide, x, t);
							}));
					var tRepeat = A5(
						$author$project$Generalise$repeatSearchT,
						t,
						largeN,
						small,
						smallN,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitSide(rRepeat)));
					return A2($author$project$Generalise$SplitSide, rRepeat, tRepeat);
				default:
					var x = tr;
					return x;
			}
		}
	});
var $author$project$Generalise$repeatSearch = F4(
	function (smallN, small, largeN, large) {
		switch (large.$) {
			case 0:
				var s = large.a;
				return $author$project$Generalise$SOp(
					A5($author$project$Generalise$repeatSearchS, s, largeN, small, smallN, $author$project$Generalise$SOp));
			case 1:
				var r = large.a;
				return $author$project$Generalise$ROp(
					A5($author$project$Generalise$repeatSearchR, r, largeN, small, smallN, $author$project$Generalise$ROp));
			case 2:
				var f = large.a;
				return $author$project$Generalise$FOp(
					A5($author$project$Generalise$repeatSearchF, f, largeN, small, smallN, $author$project$Generalise$FOp));
			case 3:
				var t = large.a;
				return $author$project$Generalise$TOp(
					A5($author$project$Generalise$repeatSearchT, t, largeN, small, smallN, $author$project$Generalise$TOp));
			default:
				var l = large.a;
				return $author$project$Generalise$LOp(
					A5($author$project$Generalise$repeatSearchL, l, largeN, small, smallN, $author$project$Generalise$LOp));
		}
	});
var $author$project$Generalise$tryStepCase = F2(
	function (_v0, _v1) {
		var stepN = _v0.a;
		var baseN = _v0.b;
		var step = _v1.a;
		var base = _v1.b;
		var generalStep = A4($author$project$Generalise$repeatSearch, baseN, base, stepN, step);
		var _v2 = A3($author$project$Generalise$findBase, generalStep, baseN, base);
		if (!_v2.$) {
			var diff = _v2.a;
			return $elm$core$Maybe$Just(
				{ah: diff, aj: generalStep});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Generalise$infer = F2(
	function (_v0, _v1) {
		var n1 = _v0.a;
		var p1 = _v0.b;
		var n2 = _v1.a;
		var p2 = _v1.b;
		if (A2($author$project$Generalise$ptEq, p1, p2)) {
			return $elm$core$Maybe$Just(
				{
					ah: $author$project$Generalise$SOp(
						$author$project$Generalise$Square(0)),
					aj: p1
				});
		} else {
			var _v2 = (_Utils_cmp(n1, n2) < 0) ? _Utils_Tuple2(n1, p1) : _Utils_Tuple2(n2, p2);
			var smallN = _v2.a;
			var smallP = _v2.b;
			var _v3 = (_Utils_cmp(n1, n2) > 0) ? _Utils_Tuple2(n1, p1) : _Utils_Tuple2(n2, p2);
			var largeN = _v3.a;
			var largeP = _v3.b;
			var testPossibleRepeats = F2(
				function (ps, rNums) {
					testPossibleRepeats:
					while (true) {
						if (rNums.b) {
							var r = rNums.a;
							var rs = rNums.b;
							if (A2(
								$elm$core$List$all,
								function (x) {
									return x;
								},
								A2(
									$elm$core$List$indexedMap,
									F2(
										function (i, p) {
											return A2(
												$lynn$elm_arithmetic$Arithmetic$divides,
												(($elm$core$List$length(ps) - 1) / r) | 0,
												i) ? $elm_community$maybe_extra$Maybe$Extra$isJust(p) : true;
										}),
									ps))) {
								return A2(
									$author$project$Generalise$ifFailed,
									A2(testPossibleRepeats, ps, rs),
									A2(
										$elm$core$Maybe$andThen,
										$author$project$Generalise$tryStepCase(
											_Utils_Tuple2(largeN, largeN - (((largeN - smallN) / r) | 0))),
										A2(
											$elm$core$Maybe$withDefault,
											$elm$core$Maybe$Nothing,
											A2(
												$elm_community$list_extra$List$Extra$getAt,
												(($elm$core$List$length(ps) - 1) / r) | 0,
												ps))));
							} else {
								var $temp$ps = ps,
									$temp$rNums = rs;
								ps = $temp$ps;
								rNums = $temp$rNums;
								continue testPossibleRepeats;
							}
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}
				});
			var mDiff = A2($author$project$Generalise$findDifference, smallP, largeP);
			var _v5 = _Utils_Tuple3(
				A2(
					$elm$core$Maybe$andThen,
					$author$project$Generalise$findPossibleRepeatPoints(smallP),
					mDiff),
				mDiff,
				_Utils_eq(largeN, smallN));
			if (((!_v5.a.$) && (!_v5.b.$)) && (!_v5.c)) {
				var ps = _v5.a.a;
				var diff = _v5.b.a;
				return A2(
					testPossibleRepeats,
					ps,
					$elm$core$List$reverse(
						$lynn$elm_arithmetic$Arithmetic$divisors(
							A2(
								$lynn$elm_arithmetic$Arithmetic$gcd,
								largeN - smallN,
								$elm$core$List$length(ps) - 1))));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Discover$discoverProof = F3(
	function (reprs, n1, n2) {
		discoverProof:
		while (true) {
			if (reprs.b) {
				var _v1 = reprs.a;
				var r = _v1.a;
				var _v2 = _v1.b;
				var sb = _v2.a;
				var gb = _v2.b;
				var _v3 = _v1.c;
				var ss = _v3.a;
				var gs = _v3.b;
				var xs = reprs.b;
				var smallProof = A2($author$project$Search$findProof, ss, gs);
				var bigProof = A2($author$project$Search$findProof, sb, gb);
				var proof = function () {
					var _v5 = _Utils_Tuple2(bigProof, smallProof);
					if ((!_v5.a.$) && (!_v5.b.$)) {
						var bp = _v5.a.a;
						var sp = _v5.b.a;
						return A2(
							$author$project$Generalise$infer,
							_Utils_Tuple2(n1, bp),
							_Utils_Tuple2(n2, sp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				if (!proof.$) {
					var sp = proof.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(r, sp));
				} else {
					var $temp$reprs = xs,
						$temp$n1 = n1,
						$temp$n2 = n2;
					reprs = $temp$reprs;
					n1 = $temp$n1;
					n2 = $temp$n2;
					continue discoverProof;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RecursiveSearch$Building = function (a) {
	return {$: 0, a: a};
};
var $author$project$RecursiveSearch$Found = function (a) {
	return {$: 1, a: a};
};
var $author$project$RecursiveSearch$NextF = function (a) {
	return {$: 3, a: a};
};
var $author$project$RecursiveSearch$NextL = function (a) {
	return {$: 4, a: a};
};
var $author$project$RecursiveSearch$NextR = function (a) {
	return {$: 1, a: a};
};
var $author$project$RecursiveSearch$NextS = function (a) {
	return {$: 0, a: a};
};
var $author$project$RecursiveSearch$NextT = function (a) {
	return {$: 2, a: a};
};
var $author$project$RecursiveSearch$OLCutS = 0;
var $author$project$RecursiveSearch$OLCutT = 8;
var $author$project$RecursiveSearch$ORotate = 6;
var $author$project$RecursiveSearch$OSplit4 = 2;
var $author$project$RecursiveSearch$OSplitDiaR = 5;
var $author$project$RecursiveSearch$OSplitDiaS = 1;
var $author$project$RecursiveSearch$OSplitEnds = 11;
var $author$project$RecursiveSearch$OSplitFrame = 12;
var $author$project$RecursiveSearch$OSplitInner = 4;
var $author$project$RecursiveSearch$OSplitOuter = 3;
var $author$project$RecursiveSearch$OSplitSide = 10;
var $author$project$RecursiveSearch$OSplitSquare = 7;
var $author$project$RecursiveSearch$OSplitTST = 9;
var $author$project$RecursiveSearch$insert = F2(
	function (x, l) {
		if (l.b) {
			var y = l.a;
			var ys = l.b;
			var _v1 = A2($author$project$Generalise$sortPt, x, y);
			switch (_v1) {
				case 1:
					return A2($elm$core$List$cons, x, l);
				case 0:
					return A2($elm$core$List$cons, x, l);
				default:
					return A2(
						$elm$core$List$cons,
						y,
						A2($author$project$RecursiveSearch$insert, x, ys));
			}
		} else {
			return _List_fromArray(
				[x]);
		}
	});
var $author$project$RecursiveSearch$findProofF = F7(
	function (ops, ff, build, found, rGoal, goal, backtrack) {
		if (ff.$ === 1) {
			var n1 = ff.a;
			var n2 = ff.b;
			var splitframeSearch = F2(
				function (bt, _v36) {
					var doSearch = function (newOps) {
						return (_Utils_cmp(n1, n2) > 0) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextR(
								{
									a: F2(
										function (r1, fo1) {
											return $author$project$RecursiveSearch$NextR(
												{
													a: F2(
														function (r2, fo2) {
															return $author$project$RecursiveSearch$NextR(
																{
																	a: F2(
																		function (r3, fo3) {
																			return $author$project$RecursiveSearch$NextR(
																				{
																					a: F2(
																						function (r4, fo4) {
																							return A2(
																								build,
																								A4($author$project$Generalise$SplitFrame, r1, r2, r3, r4),
																								fo4);
																						}),
																					b: fo3,
																					c: A2($author$project$Generalise$diffPt, goal, fo3),
																					n: false,
																					y: A2($author$project$Generalise$Rect, n2, n1 - n2)
																				});
																		}),
																	b: fo2,
																	c: A2($author$project$Generalise$diffPt, goal, fo2),
																	n: false,
																	y: A2($author$project$Generalise$Rect, n2, n1 - n2)
																});
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													n: false,
													y: A2($author$project$Generalise$Rect, n1 - n2, n2)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									n: false,
									y: A2($author$project$Generalise$Rect, n1 - n2, n2)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 12, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 12, fops) ? doSearch(ops) : bt(0);
					}
				});
			var shape = function () {
				var _v34 = _Utils_Tuple2(n1, n2);
				if ((_v34.a === 1) && (_v34.b === 1)) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$FOp(ff);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A4(
					$author$project$RecursiveSearch$findProofHelper,
					ops,
					goal,
					A2(
						build,
						ff,
						A2($author$project$RecursiveSearch$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitframeSearch(backtrack));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RecursiveSearch$findProofHelper = F4(
	function (ops, goal, points, backtrack) {
		switch (points.$) {
			case 0:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$SOp(shape),
					rGoal)) ? backtrack(0) : A7($author$project$RecursiveSearch$findProofS, ops, shape, build, found, rGoal, goal, backtrack);
			case 1:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				var rotate = points.a.n;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$ROp(shape),
					rGoal)) ? backtrack(0) : A8($author$project$RecursiveSearch$findProofR, ops, rotate, shape, build, found, rGoal, goal, backtrack);
			case 2:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$TOp(shape),
					rGoal)) ? backtrack(0) : A7($author$project$RecursiveSearch$findProofT, ops, shape, build, found, rGoal, goal, backtrack);
			case 3:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$FOp(shape),
					rGoal)) ? backtrack(0) : A7($author$project$RecursiveSearch$findProofF, ops, shape, build, found, rGoal, goal, backtrack);
			case 4:
				var shape = points.a.y;
				var found = points.a.b;
				var rGoal = points.a.c;
				var build = points.a.a;
				return (!A2(
					$author$project$Heuristics$reachableGoalCheck,
					$author$project$Generalise$LOp(shape),
					rGoal)) ? backtrack(0) : A7($author$project$RecursiveSearch$findProofL, ops, shape, build, found, rGoal, goal, backtrack);
			default:
				var pt = points.a;
				var found = points.b;
				return _Utils_eq(found, goal) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(ops, pt)) : backtrack(0);
		}
	});
var $author$project$RecursiveSearch$findProofL = F7(
	function (ops, ll, build, found, rGoal, goal, backtrack) {
		if (ll.$ === 1) {
			var n = ll.a;
			var splitendsSearch = F2(
				function (bt, _v31) {
					var doSearch = function (newOps) {
						return (n > 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextR(
								{
									a: F2(
										function (r, fo1) {
											return $author$project$RecursiveSearch$NextL(
												{
													a: F2(
														function (l, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitEnds, r, l),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$L(n - 1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									n: false,
									y: A2($author$project$Generalise$Rect, 1, 2)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 11, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 11, fops) ? doSearch(ops) : bt(0);
					}
				});
			var shape = function () {
				if (n === 1) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$LOp(ll);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A4(
					$author$project$RecursiveSearch$findProofHelper,
					ops,
					goal,
					A2(
						build,
						ll,
						A2($author$project$RecursiveSearch$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitendsSearch(backtrack));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RecursiveSearch$findProofR = F8(
	function (ops, rotate, rr, build, found, rGoal, goal, backtrack) {
		if (rr.$ === 4) {
			var n1 = rr.a;
			var n2 = rr.b;
			var tosquareSearch = F2(
				function (bt, _v27) {
					return _Utils_eq(n1, n2) ? A4(
						$author$project$RecursiveSearch$findProofHelper,
						ops,
						goal,
						$author$project$RecursiveSearch$NextS(
							{
								a: F2(
									function (s, fo1) {
										return A2(
											build,
											$author$project$Generalise$ToSquare(s),
											fo1);
									}),
								b: found,
								c: A2($author$project$Generalise$diffPt, goal, found),
								y: $author$project$Generalise$Square(n1)
							}),
						bt) : bt(0);
				});
			var splitsquareSearch = F2(
				function (bt, _v26) {
					var doSearch = function (newOps) {
						return (_Utils_cmp(n1, n2) > 0) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextS(
								{
									a: F2(
										function (s, fo1) {
											return $author$project$RecursiveSearch$NextR(
												{
													a: F2(
														function (r, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitSquare, s, r),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													n: false,
													y: A2($author$project$Generalise$Rect, n1 - n2, n2)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Square(n2)
								}),
							bt) : ((_Utils_cmp(n2, n1) > 0) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextS(
								{
									a: F2(
										function (s, fo1) {
											return $author$project$RecursiveSearch$NextR(
												{
													a: F2(
														function (r, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitSquare, s, r),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													n: false,
													y: A2($author$project$Generalise$Rect, n1, n2 - n1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Square(n1)
								}),
							bt) : bt(0));
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 7, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 7, fops) ? doSearch(ops) : bt(0);
					}
				});
			var splitdiaSearch = F2(
				function (bt, _v24) {
					var doSearch = function (newOps) {
						return ((n1 - n2) === 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextT(
								{
									a: F2(
										function (t1, fo1) {
											return $author$project$RecursiveSearch$NextT(
												{
													a: F2(
														function (t2, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitDiaR, t1, t2),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Tri(n2)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Tri(n2)
								}),
							bt) : (((n2 - n1) === 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextT(
								{
									a: F2(
										function (t1, fo1) {
											return $author$project$RecursiveSearch$NextT(
												{
													a: F2(
														function (t2, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitDiaR, t1, t2),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Tri(n1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Tri(n1)
								}),
							bt) : bt(0));
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 5, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 5, fops) ? doSearch(ops) : bt(0);
					}
				});
			var shape = function () {
				var _v22 = _Utils_Tuple2(n1, n2);
				if ((_v22.a === 1) && (_v22.b === 1)) {
					return $author$project$Generalise$SOp(
						$author$project$Generalise$Square(1));
				} else {
					return $author$project$Generalise$ROp(rr);
				}
			}();
			var rotateSearch = F2(
				function (bt, _v21) {
					var doSearch = function (newOps) {
						return (!rotate) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextR(
								{
									a: F2(
										function (r, fo1) {
											return A2(
												build,
												$author$project$Generalise$Rotate(r),
												fo1);
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									n: true,
									y: A2($author$project$Generalise$Rect, n2, n1)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 6, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 6, fops) ? doSearch(ops) : bt(0);
					}
				});
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A4(
					$author$project$RecursiveSearch$findProofHelper,
					ops,
					goal,
					A2(
						build,
						rr,
						A2($author$project$RecursiveSearch$insert, shape, found)),
					bt) : bt(0);
			};
			return noopSearch(
				splitdiaSearch(
					splitsquareSearch(
						tosquareSearch(
							rotateSearch(backtrack)))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RecursiveSearch$findProofS = F7(
	function (ops, ss, build, found, rGoal, goal, backtrack) {
		if (ss.$ === 5) {
			var n = ss.a;
			var splitouterSearch = F2(
				function (bt, _v18) {
					var doSearch = function (newOps) {
						return (n >= 3) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextF(
								{
									a: F2(
										function (f, fo1) {
											return $author$project$RecursiveSearch$NextS(
												{
													a: F2(
														function (s, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitOuterFrame, f, s),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Square(n - 2)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: A2($author$project$Generalise$Frame, n, 1)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 3, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 3, fops) ? doSearch(ops) : bt(0);
					}
				});
			var splitinnerSearch = F2(
				function (bt, _v16) {
					var doSearch = function (newOps) {
						return (n >= 3) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextF(
								{
									a: F2(
										function (f, fo1) {
											return $author$project$RecursiveSearch$NextS(
												{
													a: F2(
														function (s, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitInnerSquare, f, s),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Square(n - (2 * (((n - 1) / 2) | 0)))
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: A2($author$project$Generalise$Frame, n, ((n - 1) / 2) | 0)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 4, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 4, fops) ? doSearch(ops) : bt(0);
					}
				});
			var splitdiaSearch = F2(
				function (bt, _v14) {
					var doSearch = function (newOps) {
						return (n > 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextT(
								{
									a: F2(
										function (t1, fo1) {
											return $author$project$RecursiveSearch$NextT(
												{
													a: F2(
														function (t2, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitDiaS, t1, t2),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Tri(n - 1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Tri(n)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 1, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 1, fops) ? doSearch(ops) : bt(0);
					}
				});
			var split4Search = F2(
				function (bt, _v12) {
					var doSearch = function (newOps) {
						return ((n >= 2) && (!A2($elm$core$Basics$modBy, 2, n))) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextS(
								{
									a: F2(
										function (s1, fo1) {
											return $author$project$RecursiveSearch$NextS(
												{
													a: F2(
														function (s2, fo2) {
															return $author$project$RecursiveSearch$NextS(
																{
																	a: F2(
																		function (s3, fo3) {
																			return $author$project$RecursiveSearch$NextS(
																				{
																					a: F2(
																						function (s4, fo4) {
																							return A2(
																								build,
																								A4($author$project$Generalise$Split4, s1, s2, s3, s3),
																								fo4);
																						}),
																					b: fo3,
																					c: A2($author$project$Generalise$diffPt, goal, fo3),
																					y: $author$project$Generalise$Square((n / 2) | 0)
																				});
																		}),
																	b: fo2,
																	c: A2($author$project$Generalise$diffPt, goal, fo2),
																	y: $author$project$Generalise$Square((n / 2) | 0)
																});
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Square((n / 2) | 0)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Square((n / 2) | 0)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 2, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 2, fops) ? doSearch(ops) : bt(0);
					}
				});
			var noopSearch = function (bt) {
				return A2(
					$elm$core$List$member,
					$author$project$Generalise$SOp(ss),
					rGoal) ? A4(
					$author$project$RecursiveSearch$findProofHelper,
					ops,
					goal,
					A2(
						build,
						ss,
						A2(
							$author$project$RecursiveSearch$insert,
							$author$project$Generalise$SOp(ss),
							found)),
					bt) : bt(0);
			};
			var lcutSearch = F2(
				function (bt, _v10) {
					var doSearch = function (newOps) {
						return (n > 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextL(
								{
									a: F2(
										function (l, fo1) {
											return $author$project$RecursiveSearch$NextS(
												{
													a: F2(
														function (s, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$LCutS, l, s),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Square(n - 1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$L(n)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 0, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 0, fops) ? doSearch(ops) : bt(0);
					}
				});
			return noopSearch(
				lcutSearch(
					splitdiaSearch(
						splitinnerSearch(
							splitouterSearch(
								split4Search(backtrack))))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RecursiveSearch$findProofT = F7(
	function (ops, tt, build, found, rGoal, goal, backtrack) {
		if (tt.$ === 3) {
			var n = tt.a;
			var splittstSearch = F2(
				function (bt, _v7) {
					var doSearch = function (newOps) {
						return (n > 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextT(
								{
									a: F2(
										function (t1, fo1) {
											return $author$project$RecursiveSearch$NextS(
												{
													a: F2(
														function (s, fo2) {
															return $author$project$RecursiveSearch$NextT(
																{
																	a: F2(
																		function (t2, fo3) {
																			return A2(
																				build,
																				A3($author$project$Generalise$SplitTST, t1, s, t2),
																				fo3);
																		}),
																	b: fo2,
																	c: A2($author$project$Generalise$diffPt, goal, fo2),
																	y: $author$project$Generalise$Tri((n / 2) | 0)
																});
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Square(n - ((n / 2) | 0))
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$Tri((n / 2) | 0)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 9, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 9, fops) ? doSearch(ops) : bt(0);
					}
				});
			var splitsideSearch = F2(
				function (bt, _v5) {
					var doSearch = function (newOps) {
						return (n > 1) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextR(
								{
									a: F2(
										function (r, fo1) {
											return $author$project$RecursiveSearch$NextT(
												{
													a: F2(
														function (t, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$SplitSide, r, t),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Tri(n - 1)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									n: false,
									y: A2($author$project$Generalise$Rect, 1, n)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 10, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 10, fops) ? doSearch(ops) : bt(0);
					}
				});
			var shape = function () {
				switch (n) {
					case 1:
						return $author$project$Generalise$SOp(
							$author$project$Generalise$Square(1));
					case 2:
						return $author$project$Generalise$LOp(
							$author$project$Generalise$L(2));
					default:
						return $author$project$Generalise$TOp(tt);
				}
			}();
			var noopSearch = function (bt) {
				return A2($elm$core$List$member, shape, rGoal) ? A4(
					$author$project$RecursiveSearch$findProofHelper,
					ops,
					goal,
					A2(
						build,
						tt,
						A2($author$project$RecursiveSearch$insert, shape, found)),
					bt) : bt(0);
			};
			var lcutSearch = F2(
				function (bt, _v2) {
					var doSearch = function (newOps) {
						return (n > 2) ? A4(
							$author$project$RecursiveSearch$findProofHelper,
							newOps,
							goal,
							$author$project$RecursiveSearch$NextL(
								{
									a: F2(
										function (l, fo1) {
											return $author$project$RecursiveSearch$NextT(
												{
													a: F2(
														function (t, fo2) {
															return A2(
																build,
																A2($author$project$Generalise$LCutT, l, t),
																fo2);
														}),
													b: fo1,
													c: A2($author$project$Generalise$diffPt, goal, fo1),
													y: $author$project$Generalise$Tri(n - 2)
												});
										}),
									b: found,
									c: A2($author$project$Generalise$diffPt, goal, found),
									y: $author$project$Generalise$L(n)
								}),
							bt) : bt(0);
					};
					if (!ops.$) {
						var bops = ops.a;
						return doSearch(
							$author$project$RecursiveSearch$Building(
								A2($elm$core$List$cons, 8, bops)));
					} else {
						var fops = ops.a;
						return A2($elm$core$List$member, 8, fops) ? doSearch(ops) : bt(0);
					}
				});
			return noopSearch(
				splittstSearch(
					lcutSearch(
						splitsideSearch(backtrack))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RecursiveSearch$findProof = F3(
	function (ops, start, goal) {
		var sGoal = A2(
			$elm$core$List$sortWith,
			$author$project$Generalise$sortPt,
			A2($elm$core$List$map, $author$project$Generalise$normalizeG, goal));
		return A4(
			$author$project$RecursiveSearch$findProofHelper,
			ops,
			sGoal,
			start,
			$elm$core$Basics$always($elm$core$Maybe$Nothing));
	});
var $author$project$RecursiveSearch$Done = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$RecursiveSearch$recursiveOptions = F3(
	function (small, large, goal) {
		var _v0 = _Utils_Tuple2(small, large);
		_v0$4:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (((_v0.a.a.$ === 5) && (!_v0.b.$)) && (_v0.b.a.$ === 5)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						var _v1 = n - m;
						switch (_v1) {
							case 1:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l, fo1) {
														return A2(
															$author$project$RecursiveSearch$Done,
															function (s) {
																if (!s.$) {
																	var ss = s.a;
																	return $elm$core$Maybe$Just(
																		$author$project$Generalise$SOp(
																			A2($author$project$Generalise$LCutS, l, ss)));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															},
															fo1);
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											})
										]));
							case 2:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l1, fo1) {
														return $author$project$RecursiveSearch$NextL(
															{
																a: F2(
																	function (l2, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (s) {
																				if (!s.$) {
																					var ss = s.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$SOp(
																							A2(
																								$author$project$Generalise$LCutS,
																								l1,
																								A2($author$project$Generalise$LCutS, l2, ss))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																y: $author$project$Generalise$L(n - 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											}),
											$author$project$RecursiveSearch$NextF(
											{
												a: F2(
													function (f, fo1) {
														return A2(
															$author$project$RecursiveSearch$Done,
															function (s) {
																if (!s.$) {
																	var ss = s.a;
																	return $elm$core$Maybe$Just(
																		$author$project$Generalise$SOp(
																			A2($author$project$Generalise$SplitOuterFrame, f, ss)));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															},
															fo1);
													}),
												b: _List_Nil,
												c: goal,
												y: A2($author$project$Generalise$Frame, n, 1)
											})
										]));
							case 3:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l1, fo1) {
														return $author$project$RecursiveSearch$NextL(
															{
																a: F2(
																	function (l2, fo2) {
																		return $author$project$RecursiveSearch$NextL(
																			{
																				a: F2(
																					function (l3, fo3) {
																						return A2(
																							$author$project$RecursiveSearch$Done,
																							function (s) {
																								if (!s.$) {
																									var ss = s.a;
																									return $elm$core$Maybe$Just(
																										$author$project$Generalise$SOp(
																											A2(
																												$author$project$Generalise$LCutS,
																												l1,
																												A2(
																													$author$project$Generalise$LCutS,
																													l2,
																													A2($author$project$Generalise$LCutS, l3, ss)))));
																								} else {
																									return $elm$core$Maybe$Nothing;
																								}
																							},
																							fo3);
																					}),
																				b: fo2,
																				c: A2($author$project$Generalise$diffPt, goal, fo2),
																				y: $author$project$Generalise$L(n - 2)
																			});
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																y: $author$project$Generalise$L(n - 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											}),
											$author$project$RecursiveSearch$NextF(
											{
												a: F2(
													function (f, fo1) {
														return $author$project$RecursiveSearch$NextL(
															{
																a: F2(
																	function (l, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (s) {
																				if (!s.$) {
																					var ss = s.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$SOp(
																							A2(
																								$author$project$Generalise$SplitOuterFrame,
																								f,
																								A2($author$project$Generalise$LCutS, l, ss))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																y: $author$project$Generalise$L(n - 2)
															});
													}),
												b: _List_Nil,
												c: goal,
												y: A2($author$project$Generalise$Frame, n, 1)
											}),
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l, fo1) {
														return $author$project$RecursiveSearch$NextF(
															{
																a: F2(
																	function (f, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (s) {
																				if (!s.$) {
																					var ss = s.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$SOp(
																							A2(
																								$author$project$Generalise$LCutS,
																								l,
																								A2($author$project$Generalise$SplitOuterFrame, f, ss))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																y: A2($author$project$Generalise$Frame, n - 1, 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											})
										]));
							default:
								return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$4;
					}
				case 3:
					if (((_v0.a.a.$ === 3) && (_v0.b.$ === 3)) && (_v0.b.a.$ === 3)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						var _v8 = n - m;
						switch (_v8) {
							case 1:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r, fo1) {
														return A2(
															$author$project$RecursiveSearch$Done,
															function (t) {
																if (t.$ === 3) {
																	var tt = t.a;
																	return $elm$core$Maybe$Just(
																		$author$project$Generalise$TOp(
																			A2($author$project$Generalise$SplitSide, r, tt)));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															},
															fo1);
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, n)
											})
										]));
							case 2:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r1, fo1) {
														return $author$project$RecursiveSearch$NextR(
															{
																a: F2(
																	function (r2, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (t) {
																				if (t.$ === 3) {
																					var tt = t.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$TOp(
																							A2(
																								$author$project$Generalise$SplitSide,
																								r1,
																								A2($author$project$Generalise$SplitSide, r2, tt))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																n: false,
																y: A2($author$project$Generalise$Rect, 1, n - 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, n)
											}),
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l, fo1) {
														return A2(
															$author$project$RecursiveSearch$Done,
															function (t) {
																if (t.$ === 3) {
																	var tt = t.a;
																	return $elm$core$Maybe$Just(
																		$author$project$Generalise$TOp(
																			A2($author$project$Generalise$LCutT, l, tt)));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															},
															fo1);
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											})
										]));
							case 3:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r1, fo1) {
														return $author$project$RecursiveSearch$NextR(
															{
																a: F2(
																	function (r2, fo2) {
																		return $author$project$RecursiveSearch$NextR(
																			{
																				a: F2(
																					function (r3, fo3) {
																						return A2(
																							$author$project$RecursiveSearch$Done,
																							function (t) {
																								if (t.$ === 3) {
																									var tt = t.a;
																									return $elm$core$Maybe$Just(
																										$author$project$Generalise$TOp(
																											A2(
																												$author$project$Generalise$SplitSide,
																												r1,
																												A2(
																													$author$project$Generalise$SplitSide,
																													r2,
																													A2($author$project$Generalise$SplitSide, r3, tt)))));
																								} else {
																									return $elm$core$Maybe$Nothing;
																								}
																							},
																							fo3);
																					}),
																				b: fo2,
																				c: A2($author$project$Generalise$diffPt, goal, fo2),
																				n: false,
																				y: A2($author$project$Generalise$Rect, 1, n - 2)
																			});
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																n: false,
																y: A2($author$project$Generalise$Rect, 1, n - 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, n)
											}),
											$author$project$RecursiveSearch$NextL(
											{
												a: F2(
													function (l, fo1) {
														return $author$project$RecursiveSearch$NextR(
															{
																a: F2(
																	function (r, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (t) {
																				if (t.$ === 3) {
																					var tt = t.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$TOp(
																							A2(
																								$author$project$Generalise$LCutT,
																								l,
																								A2($author$project$Generalise$SplitSide, r, tt))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																n: false,
																y: A2($author$project$Generalise$Rect, 1, n - 2)
															});
													}),
												b: _List_Nil,
												c: goal,
												y: $author$project$Generalise$L(n)
											}),
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r, fo1) {
														return $author$project$RecursiveSearch$NextL(
															{
																a: F2(
																	function (l, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (t) {
																				if (t.$ === 3) {
																					var tt = t.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$TOp(
																							A2(
																								$author$project$Generalise$SplitSide,
																								r,
																								A2($author$project$Generalise$LCutT, l, tt))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																y: $author$project$Generalise$L(n - 1)
															});
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, n)
											})
										]));
							default:
								return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$4;
					}
				case 1:
					if (((_v0.a.a.$ === 4) && (_v0.b.$ === 1)) && (_v0.b.a.$ === 4)) {
						var _v15 = _v0.a.a;
						var m1 = _v15.a;
						var m2 = _v15.b;
						var _v16 = _v0.b.a;
						var n1 = _v16.a;
						var n2 = _v16.b;
						return (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1 - n2, n2))) || (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1, n2 - n1))) || (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n2, n1 - n2))) || _Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n2 - n1, n1)))))) ? $elm$core$Maybe$Just(
							_List_fromArray(
								[
									$author$project$RecursiveSearch$NextS(
									{
										a: F2(
											function (s, fo1) {
												return A2(
													$author$project$RecursiveSearch$Done,
													function (r) {
														if (r.$ === 1) {
															var rr = r.a;
															return $elm$core$Maybe$Just(
																$author$project$Generalise$ROp(
																	A2($author$project$Generalise$SplitSquare, s, rr)));
														} else {
															return $elm$core$Maybe$Nothing;
														}
													},
													fo1);
											}),
										b: _List_Nil,
										c: goal,
										y: $author$project$Generalise$Square(
											A2($elm$core$Basics$min, n1, n2))
									})
								])) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$4;
					}
				case 4:
					if (((_v0.a.a.$ === 1) && (_v0.b.$ === 4)) && (_v0.b.a.$ === 1)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						var _v18 = n - m;
						switch (_v18) {
							case 1:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r, fo1) {
														return A2(
															$author$project$RecursiveSearch$Done,
															function (l) {
																if (l.$ === 4) {
																	var ll = l.a;
																	return $elm$core$Maybe$Just(
																		$author$project$Generalise$LOp(
																			A2($author$project$Generalise$SplitEnds, r, ll)));
																} else {
																	return $elm$core$Maybe$Nothing;
																}
															},
															fo1);
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, 2)
											})
										]));
							case 2:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r1, fo1) {
														return $author$project$RecursiveSearch$NextR(
															{
																a: F2(
																	function (r2, fo2) {
																		return A2(
																			$author$project$RecursiveSearch$Done,
																			function (l) {
																				if (l.$ === 4) {
																					var ll = l.a;
																					return $elm$core$Maybe$Just(
																						$author$project$Generalise$LOp(
																							A2(
																								$author$project$Generalise$SplitEnds,
																								r1,
																								A2($author$project$Generalise$SplitEnds, r2, ll))));
																				} else {
																					return $elm$core$Maybe$Nothing;
																				}
																			},
																			fo2);
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																n: false,
																y: A2($author$project$Generalise$Rect, 1, 2)
															});
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, 2)
											})
										]));
							case 3:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											$author$project$RecursiveSearch$NextR(
											{
												a: F2(
													function (r1, fo1) {
														return $author$project$RecursiveSearch$NextR(
															{
																a: F2(
																	function (r2, fo2) {
																		return $author$project$RecursiveSearch$NextR(
																			{
																				a: F2(
																					function (r3, fo3) {
																						return A2(
																							$author$project$RecursiveSearch$Done,
																							function (l) {
																								if (l.$ === 4) {
																									var ll = l.a;
																									return $elm$core$Maybe$Just(
																										$author$project$Generalise$LOp(
																											A2(
																												$author$project$Generalise$SplitEnds,
																												r1,
																												A2(
																													$author$project$Generalise$SplitEnds,
																													r2,
																													A2($author$project$Generalise$SplitEnds, r3, ll)))));
																								} else {
																									return $elm$core$Maybe$Nothing;
																								}
																							},
																							fo3);
																					}),
																				b: fo2,
																				c: A2($author$project$Generalise$diffPt, goal, fo2),
																				n: false,
																				y: A2($author$project$Generalise$Rect, 1, 2)
																			});
																	}),
																b: fo1,
																c: A2($author$project$Generalise$diffPt, goal, fo1),
																n: false,
																y: A2($author$project$Generalise$Rect, 1, 2)
															});
													}),
												b: _List_Nil,
												c: goal,
												n: false,
												y: A2($author$project$Generalise$Rect, 1, 2)
											})
										]));
							default:
								return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$4;
					}
				default:
					break _v0$4;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $elm_community$list_extra$List$Extra$remove = F2(
	function (x, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var y = xs.a;
			var ys = xs.b;
			return _Utils_eq(x, y) ? ys : A2(
				$elm$core$List$cons,
				y,
				A2($elm_community$list_extra$List$Extra$remove, x, ys));
		}
	});
var $author$project$Util$subtractList = F2(
	function (l1, l2) {
		subtractList:
		while (true) {
			if (l2.b) {
				var x = l2.a;
				var xs = l2.b;
				if (A2($elm$core$List$member, x, l1)) {
					var $temp$l1 = A2($elm_community$list_extra$List$Extra$remove, x, l1),
						$temp$l2 = xs;
					l1 = $temp$l1;
					l2 = $temp$l2;
					continue subtractList;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Just(l1);
			}
		}
	});
var $author$project$RecursiveSearch$findProofRecursive_ = F3(
	function (ops, n, _v0) {
		var start = _v0.a;
		var goal = _v0.b;
		if (n === 1) {
			var _v2 = _Utils_Tuple2(
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', 1)
							])),
					start),
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', 1)
							])),
					goal));
			if ((((!_v2.a.$) && _v2.a.a.b) && (!_v2.a.a.b.b)) && (!_v2.b.$)) {
				var _v3 = _v2.a.a;
				var s = _v3.a;
				var g = _v2.b.a;
				return A2($author$project$Search$findProof, s, g);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			var _v4 = _Utils_Tuple2(
				_Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n)
								])),
						start),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n - 1)
								])),
						start)),
				_Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n)
								])),
						goal),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', n - 1)
								])),
						goal)));
			if ((((((((!_v4.a.a.$) && _v4.a.a.a.b) && (!_v4.a.a.a.b.b)) && (!_v4.a.b.$)) && _v4.a.b.a.b) && (!_v4.a.b.a.b.b)) && (!_v4.b.a.$)) && (!_v4.b.b.$)) {
				var _v5 = _v4.a;
				var _v6 = _v5.a.a;
				var actualStart = _v6.a;
				var _v7 = _v5.b.a;
				var smallerStart = _v7.a;
				var _v8 = _v4.b;
				var actualGoal = _v8.a.a;
				var smallerGoal = _v8.b.a;
				var recursiveStarts = function (gg) {
					return A3($author$project$RecursiveSearch$recursiveOptions, smallerStart, actualStart, gg);
				};
				var recursiveGoal = A2($author$project$Util$subtractList, actualGoal, smallerGoal);
				var build = function (o) {
					if (!o.$) {
						var b = o.a;
						return $author$project$RecursiveSearch$Found(b);
					} else {
						return o;
					}
				};
				var tryOption = F2(
					function (options, trueGoal) {
						tryOption:
						while (true) {
							if (!options.b) {
								return $elm$core$Maybe$Nothing;
							} else {
								var x = options.a;
								var xs = options.b;
								var _v10 = A3($author$project$RecursiveSearch$findProof, ops, x, trueGoal);
								if (!_v10.$) {
									var _v11 = _v10.a;
									var newOps = _v11.a;
									var partialProof = _v11.b;
									return A2(
										$elm$core$Maybe$andThen,
										partialProof,
										A3(
											$author$project$RecursiveSearch$findProofRecursive_,
											build(newOps),
											n - 1,
											_Utils_Tuple2(start, goal)));
								} else {
									var $temp$options = xs,
										$temp$trueGoal = trueGoal;
									options = $temp$options;
									trueGoal = $temp$trueGoal;
									continue tryOption;
								}
							}
						}
					});
				if (!recursiveGoal.$) {
					var trueGoal = recursiveGoal.a;
					var _v13 = recursiveStarts(
						A2(
							$elm$core$List$sortWith,
							$author$project$Generalise$sortPt,
							A2($elm$core$List$map, $author$project$Generalise$normalizeG, trueGoal)));
					if (!_v13.$) {
						var starts = _v13.a;
						return A2(tryOption, starts, trueGoal);
					} else {
						return A2($author$project$Search$findProof, actualStart, actualGoal);
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RecursiveSearch$findProofRecursive = F2(
	function (n, repr) {
		return A3(
			$author$project$RecursiveSearch$findProofRecursive_,
			$author$project$RecursiveSearch$Building(_List_Nil),
			n,
			repr);
	});
var $author$project$Discover$discoverRecursive = F3(
	function (reprs, smallN, bigN) {
		discoverRecursive:
		while (true) {
			if (reprs.b) {
				var x = reprs.a;
				var xs = reprs.b;
				var smallProof = A2($author$project$RecursiveSearch$findProofRecursive, smallN, x);
				var shape = function () {
					if (x.a.b && (!x.a.b.b)) {
						var _v4 = x.a;
						var s = _v4.a;
						return $elm$core$Maybe$Just(s);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var bigProof = A2($author$project$RecursiveSearch$findProofRecursive, bigN, x);
				var generalProof = function () {
					var _v2 = _Utils_Tuple2(bigProof, smallProof);
					if ((!_v2.a.$) && (!_v2.b.$)) {
						var bp = _v2.a.a;
						var sp = _v2.b.a;
						return A2(
							$author$project$Generalise$infer,
							_Utils_Tuple2(bigN, bp),
							_Utils_Tuple2(smallN, sp));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var _v1 = _Utils_Tuple2(shape, generalProof);
				if ((!_v1.a.$) && (!_v1.b.$)) {
					var r = _v1.a.a;
					var sp = _v1.b.a;
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(r, sp));
				} else {
					var $temp$reprs = xs,
						$temp$smallN = smallN,
						$temp$bigN = bigN;
					reprs = $temp$reprs;
					smallN = $temp$smallN;
					bigN = $temp$bigN;
					continue discoverRecursive;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Heuristics$isRecursive = function (repr) {
	var _v0 = _Utils_Tuple2(
		A2(
			$author$project$Generalise$repr2Goal,
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('n', 3)
					])),
			repr),
		A2(
			$author$project$Generalise$repr2Goal,
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('n', 2)
					])),
			repr));
	if ((!_v0.a.$) && (!_v0.b.$)) {
		var c1 = _v0.a.a;
		var c2 = _v0.b.a;
		return _Utils_cmp(
			$elm$core$List$length(c1),
			$elm$core$List$length(c2)) > 0;
	} else {
		return false;
	}
};
var $author$project$Heuristics$recursiveShapes = F2(
	function (small, large) {
		var _v0 = _Utils_Tuple2(small, large);
		_v0$4:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (((_v0.a.a.$ === 5) && (!_v0.b.$)) && (_v0.b.a.$ === 5)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						var _v1 = n - m;
						switch (_v1) {
							case 1:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n))
											])
										]));
							case 2:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n)),
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n - 1))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$FOp(
												A2($author$project$Generalise$Frame, n, 1))
											])
										]));
							case 3:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n)),
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n - 1)),
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n - 2))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$FOp(
												A2($author$project$Generalise$Frame, n, 1)),
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n - 2))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n)),
												$author$project$Generalise$FOp(
												A2($author$project$Generalise$Frame, n - 1, 1))
											])
										]));
							default:
								return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$4;
					}
				case 3:
					if (((_v0.a.a.$ === 3) && (_v0.b.$ === 3)) && (_v0.b.a.$ === 3)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						var _v2 = n - m;
						switch (_v2) {
							case 1:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n))
											])
										]));
							case 2:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n)),
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n - 1))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n))
											])
										]));
							case 3:
								return $elm$core$Maybe$Just(
									_List_fromArray(
										[
											_List_fromArray(
											[
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n)),
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n - 1)),
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n - 2))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n)),
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n - 2))
											]),
											_List_fromArray(
											[
												$author$project$Generalise$ROp(
												A2($author$project$Generalise$Rect, 1, n)),
												$author$project$Generalise$LOp(
												$author$project$Generalise$L(n - 1))
											])
										]));
							default:
								return $elm$core$Maybe$Nothing;
						}
					} else {
						break _v0$4;
					}
				case 1:
					if (((_v0.a.a.$ === 4) && (_v0.b.$ === 1)) && (_v0.b.a.$ === 4)) {
						var _v3 = _v0.a.a;
						var m1 = _v3.a;
						var m2 = _v3.b;
						var _v4 = _v0.b.a;
						var n1 = _v4.a;
						var n2 = _v4.b;
						return (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1 - n2, n2))) || (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1, n2 - n1))) || (_Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n2, n1 - n2))) || _Utils_eq(
							small,
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n2 - n1, n1)))))) ? $elm$core$Maybe$Just(
							_List_fromArray(
								[
									_List_fromArray(
									[
										$author$project$Generalise$SOp(
										$author$project$Generalise$Square(
											A2($elm$core$Basics$min, n1, n2)))
									])
								])) : $elm$core$Maybe$Nothing;
					} else {
						break _v0$4;
					}
				case 4:
					if (((_v0.a.a.$ === 1) && (_v0.b.$ === 4)) && (_v0.b.a.$ === 1)) {
						var m = _v0.a.a.a;
						var n = _v0.b.a.a;
						return $elm$core$Maybe$Just(
							_List_fromArray(
								[
									A2(
									$elm$core$List$repeat,
									n - m,
									$author$project$Generalise$ROp(
										A2($author$project$Generalise$Rect, 1, 2)))
								]));
					} else {
						break _v0$4;
					}
				default:
					break _v0$4;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm_community$list_extra$List$Extra$gatherWith = F2(
	function (testFn, list) {
		var helper = F2(
			function (scattered, gathered) {
				if (!scattered.b) {
					return $elm$core$List$reverse(gathered);
				} else {
					var toGather = scattered.a;
					var population = scattered.b;
					var _v1 = A2(
						$elm$core$List$partition,
						testFn(toGather),
						population);
					var gathering = _v1.a;
					var remaining = _v1.b;
					return A2(
						helper,
						remaining,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(toGather, gathering),
							gathered));
				}
			});
		return A2(helper, list, _List_Nil);
	});
var $elm_community$list_extra$List$Extra$gatherEquals = function (list) {
	return A2($elm_community$list_extra$List$Extra$gatherWith, $elm$core$Basics$eq, list);
};
var $author$project$Heuristics$maxTilings = F3(
	function (small, large, recursed) {
		maxTilings:
		while (true) {
			var _v0 = _Utils_Tuple2(small, large);
			_v0$0:
			while (true) {
				_v0$11:
				while (true) {
					_v0$12:
					while (true) {
						switch (_v0.a.$) {
							case 2:
								if ((_v0.b.$ === 2) && (_v0.b.a.$ === 1)) {
									break _v0$0;
								} else {
									if (_v0.a.a.$ === 1) {
										var _v2 = _v0.a.a;
										var n1 = _v2.a;
										var $temp$small = $author$project$Generalise$SOp(
											$author$project$Generalise$Square(n1)),
											$temp$large = large,
											$temp$recursed = false;
										small = $temp$small;
										large = $temp$large;
										recursed = $temp$recursed;
										continue maxTilings;
									} else {
										break _v0$12;
									}
								}
							case 0:
								switch (_v0.b.$) {
									case 2:
										if (_v0.b.a.$ === 1) {
											break _v0$0;
										} else {
											break _v0$12;
										}
									case 0:
										if ((_v0.a.a.$ === 5) && (_v0.b.a.$ === 5)) {
											var m = _v0.a.a.a;
											var n = _v0.b.a.a;
											return A2($elm$core$Basics$pow, (n / m) | 0, 2);
										} else {
											break _v0$12;
										}
									case 1:
										if ((_v0.a.a.$ === 5) && (_v0.b.a.$ === 4)) {
											var m = _v0.a.a.a;
											var _v3 = _v0.b.a;
											var n1 = _v3.a;
											var n2 = _v3.b;
											return ((n1 / m) | 0) * ((n2 / m) | 0);
										} else {
											break _v0$12;
										}
									case 3:
										if ((_v0.a.a.$ === 5) && (_v0.b.a.$ === 3)) {
											var m = _v0.a.a.a;
											var n = _v0.b.a.a;
											return $author$project$Equation$evalTri((((n + 1) / m) | 0) - 1);
										} else {
											break _v0$12;
										}
									default:
										if ((_v0.a.a.$ === 5) && (_v0.b.a.$ === 1)) {
											var m = _v0.a.a.a;
											var n = _v0.b.a.a;
											return (m === 1) ? $author$project$Heuristics$dots(large) : 0;
										} else {
											break _v0$12;
										}
								}
							case 1:
								switch (_v0.b.$) {
									case 2:
										if (_v0.b.a.$ === 1) {
											break _v0$0;
										} else {
											break _v0$12;
										}
									case 3:
										if ((_v0.a.a.$ === 4) && (_v0.b.a.$ === 3)) {
											var _v4 = _v0.a.a;
											var n = _v0.b.a.a;
											return (A3(
												$author$project$Heuristics$maxTilings,
												small,
												$author$project$Generalise$ROp(
													A2($author$project$Generalise$Rect, n, n + 1)),
												false) / 2) | 0;
										} else {
											break _v0$12;
										}
									case 4:
										if ((_v0.a.a.$ === 4) && (_v0.b.a.$ === 1)) {
											var _v5 = _v0.a.a;
											var m1 = _v5.a;
											var m2 = _v5.b;
											var n = _v0.b.a.a;
											return (A2($elm$core$Basics$min, m1, m2) !== 1) ? 0 : (((n / A2($elm$core$Basics$max, m1, m2)) | 0) + (((n - 1) / A2($elm$core$Basics$max, m1, m2)) | 0));
										} else {
											break _v0$12;
										}
									default:
										break _v0$12;
								}
							case 3:
								switch (_v0.b.$) {
									case 2:
										if (_v0.b.a.$ === 1) {
											break _v0$0;
										} else {
											break _v0$12;
										}
									case 3:
										if ((_v0.a.a.$ === 3) && (_v0.b.a.$ === 3)) {
											var m = _v0.a.a.a;
											var n = _v0.b.a.a;
											return (A3(
												$author$project$Heuristics$maxTilings,
												small,
												$author$project$Generalise$ROp(
													A2($author$project$Generalise$Rect, n, n + 1)),
												false) / 2) | 0;
										} else {
											break _v0$12;
										}
									case 4:
										if ((_v0.a.a.$ === 3) && (_v0.b.a.$ === 1)) {
											var m = _v0.a.a.a;
											var n = _v0.b.a.a;
											return (m === 1) ? $author$project$Heuristics$dots(large) : (((m === 2) && (n >= 2)) ? 1 : 0);
										} else {
											break _v0$12;
										}
									default:
										break _v0$12;
								}
							default:
								if (_v0.a.a.$ === 1) {
									switch (_v0.b.$) {
										case 2:
											if (_v0.b.a.$ === 1) {
												break _v0$0;
											} else {
												break _v0$11;
											}
										case 4:
											if (_v0.b.a.$ === 1) {
												var m = _v0.a.a.a;
												var n = _v0.b.a.a;
												return (_Utils_cmp(m, n) < 1) ? 1 : 0;
											} else {
												break _v0$11;
											}
										default:
											break _v0$11;
									}
								} else {
									if ((_v0.b.$ === 2) && (_v0.b.a.$ === 1)) {
										break _v0$0;
									} else {
										break _v0$12;
									}
								}
						}
					}
					return ($author$project$Heuristics$dots(large) / $author$project$Heuristics$dots(small)) | 0;
				}
				var m = _v0.a.a.a;
				var $temp$small = $author$project$Generalise$TOp(
					$author$project$Generalise$Tri(m)),
					$temp$large = large,
					$temp$recursed = false;
				small = $temp$small;
				large = $temp$large;
				recursed = $temp$recursed;
				continue maxTilings;
			}
			var _v1 = _v0.b.a;
			var n1 = _v1.a;
			var n2 = _v1.b;
			return 4 * A3(
				$author$project$Heuristics$maxTilings,
				small,
				$author$project$Generalise$ROp(
					A2($author$project$Generalise$Rect, n1 - n2, n2)),
				false);
		}
	});
var $author$project$Heuristics$tilingCheck = F2(
	function (goal, start) {
		return A2(
			$elm$core$List$all,
			function (_v1) {
				var item = _v1.a;
				var count = _v1.b;
				return _Utils_cmp(
					$elm$core$List$sum(
						$elm$core$List$map(
							function (a) {
								return A3($author$project$Heuristics$maxTilings, item, a, false);
							})(start)),
					count) > -1;
			},
			A2(
				$elm$core$List$map,
				function (_v0) {
					var item = _v0.a;
					var items = _v0.b;
					return _Utils_Tuple2(
						item,
						$elm$core$List$length(items) + 1);
				},
				$elm_community$list_extra$List$Extra$gatherEquals(goal)));
	});
var $author$project$Heuristics$isValidPair = F3(
	function (smallN, bigN, _v0) {
		var start = _v0.a;
		var goal = _v0.b;
		var constantCheck = function (_v13) {
			var smallStart = A2(
				$author$project$Generalise$repr2Goal,
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('n', smallN)
						])),
				start);
			var smallGoal = A2(
				$author$project$Generalise$repr2Goal,
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('n', smallN)
						])),
				goal);
			var bigStart = A2(
				$author$project$Generalise$repr2Goal,
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('n', bigN)
						])),
				start);
			var bigGoal = A2(
				$author$project$Generalise$repr2Goal,
				$elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('n', bigN)
						])),
				goal);
			var _v10 = _Utils_Tuple2(
				_Utils_Tuple2(bigStart, smallStart),
				_Utils_Tuple2(bigGoal, smallGoal));
			if ((((!_v10.a.a.$) && (!_v10.a.b.$)) && (!_v10.b.a.$)) && (!_v10.b.b.$)) {
				var _v11 = _v10.a;
				var bs = _v11.a.a;
				var ss = _v11.b.a;
				var _v12 = _v10.b;
				var bg = _v12.a.a;
				var sg = _v12.b.a;
				return A2($author$project$Heuristics$tilingCheck, bg, bs) && A2($author$project$Heuristics$tilingCheck, sg, ss);
			} else {
				return false;
			}
		};
		if ($author$project$Heuristics$isRecursive(goal) && (smallN > 1)) {
			var smallStart = function () {
				var _v7 = _Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', smallN - 1)
								])),
						start),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', smallN)
								])),
						start));
				if ((((((!_v7.a.$) && _v7.a.a.b) && (!_v7.a.a.b.b)) && (!_v7.b.$)) && _v7.b.a.b) && (!_v7.b.a.b.b)) {
					var _v8 = _v7.a.a;
					var s1 = _v8.a;
					var _v9 = _v7.b.a;
					var s2 = _v9.a;
					return A2($author$project$Heuristics$recursiveShapes, s1, s2);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			var smallGoal = A3(
				$elm$core$Maybe$map2,
				$author$project$Util$subtractList,
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', smallN)
							])),
					goal),
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', smallN - 1)
							])),
					goal));
			var bigStart = function () {
				var _v4 = _Utils_Tuple2(
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', bigN - 1)
								])),
						start),
					A2(
						$author$project$Generalise$repr2Goal,
						$elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2('n', bigN)
								])),
						start));
				if ((((((!_v4.a.$) && _v4.a.a.b) && (!_v4.a.a.b.b)) && (!_v4.b.$)) && _v4.b.a.b) && (!_v4.b.a.b.b)) {
					var _v5 = _v4.a.a;
					var s1 = _v5.a;
					var _v6 = _v4.b.a;
					var s2 = _v6.a;
					return A2($author$project$Heuristics$recursiveShapes, s1, s2);
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}();
			var bigGoal = A3(
				$elm$core$Maybe$map2,
				$author$project$Util$subtractList,
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', bigN)
							])),
					goal),
				A2(
					$author$project$Generalise$repr2Goal,
					$elm$core$Dict$fromList(
						_List_fromArray(
							[
								_Utils_Tuple2('n', bigN - 1)
							])),
					goal));
			var _v1 = _Utils_Tuple2(
				_Utils_Tuple2(bigStart, smallStart),
				_Utils_Tuple2(bigGoal, smallGoal));
			if ((((((!_v1.a.a.$) && (!_v1.a.b.$)) && (!_v1.b.a.$)) && (!_v1.b.a.a.$)) && (!_v1.b.b.$)) && (!_v1.b.b.a.$)) {
				var _v2 = _v1.a;
				var bs = _v2.a.a;
				var ss = _v2.b.a;
				var _v3 = _v1.b;
				var bg = _v3.a.a.a;
				var sg = _v3.b.a.a;
				return A2(
					$elm$core$List$any,
					$author$project$Heuristics$tilingCheck(bg),
					bs) && A2(
					$elm$core$List$any,
					$author$project$Heuristics$tilingCheck(sg),
					ss);
			} else {
				return constantCheck(0);
			}
		} else {
			return constantCheck(0);
		}
	});
var $author$project$Netherite$DotR = {$: 0};
var $author$project$Equation$Fib = function (a) {
	return {$: 8, a: a};
};
var $author$project$Netherite$LR = function (a) {
	return {$: 2, a: a};
};
var $author$project$Netherite$LineR = function (a) {
	return {$: 1, a: a};
};
var $author$project$Equation$Literal = function (a) {
	return {$: 6, a: a};
};
var $author$project$Netherite$RepeatRp = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Netherite$SquareR = function (a) {
	return {$: 3, a: a};
};
var $author$project$Netherite$SumR = function (a) {
	return {$: 6, a: a};
};
var $author$project$Netherite$TriR = function (a) {
	return {$: 4, a: a};
};
var $author$project$Equation$Var = function (a) {
	return {$: 5, a: a};
};
var $author$project$Equation$Add = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Netherite$addRepr = F2(
	function (r1, r2) {
		var _v0 = _Utils_Tuple2(r1, r2);
		_v0$4:
		while (true) {
			if (((_v0.a.b && (!_v0.a.b.b)) && _v0.b.b) && (!_v0.b.b.b)) {
				switch (_v0.a.a.$) {
					case 0:
						switch (_v0.b.a.$) {
							case 0:
								var _v1 = _v0.a;
								var _v2 = _v1.a;
								var _v3 = _v0.b;
								var _v4 = _v3.a;
								return _List_fromArray(
									[
										_List_fromArray(
										[
											$author$project$Netherite$LineR(
											$author$project$Equation$Literal(2))
										]),
										_Utils_ap(r1, r2)
									]);
							case 1:
								var _v5 = _v0.a;
								var _v6 = _v5.a;
								var _v7 = _v0.b;
								var e = _v7.a.a;
								return _List_fromArray(
									[
										_List_fromArray(
										[
											$author$project$Netherite$LineR(
											A2(
												$author$project$Equation$Add,
												$author$project$Equation$Literal(1),
												e))
										]),
										_Utils_ap(r1, r2)
									]);
							default:
								break _v0$4;
						}
					case 1:
						switch (_v0.b.a.$) {
							case 0:
								var _v8 = _v0.a;
								var e = _v8.a.a;
								var _v9 = _v0.b;
								var _v10 = _v9.a;
								return _List_fromArray(
									[
										_List_fromArray(
										[
											$author$project$Netherite$LineR(
											A2(
												$author$project$Equation$Add,
												e,
												$author$project$Equation$Literal(1)))
										]),
										_Utils_ap(r1, r2)
									]);
							case 1:
								var _v11 = _v0.a;
								var e1 = _v11.a.a;
								var _v12 = _v0.b;
								var e2 = _v12.a.a;
								return _List_fromArray(
									[
										_List_fromArray(
										[
											$author$project$Netherite$LineR(
											A2($author$project$Equation$Add, e1, e2))
										]),
										_Utils_ap(r1, r2)
									]);
							default:
								break _v0$4;
						}
					default:
						break _v0$4;
				}
			} else {
				break _v0$4;
			}
		}
		return _List_fromArray(
			[
				_Utils_ap(r1, r2)
			]);
	});
var $author$project$Equation$Sub = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Netherite$div2Repr = function (repr) {
	_v0$0:
	while (true) {
		_v0$1:
		while (true) {
			_v0$2:
			while (true) {
				_v0$3:
				while (true) {
					_v0$4:
					while (true) {
						_v0$5:
						while (true) {
							_v0$6:
							while (true) {
								if ((repr.b && (repr.a.$ === 5)) && (!repr.b.b)) {
									switch (repr.a.a.$) {
										case 0:
											switch (repr.a.b.$) {
												case 0:
													if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
														break _v0$0;
													} else {
														if ((repr.a.a.a.$ === 6) && (repr.a.a.a.a === 1)) {
															break _v0$1;
														} else {
															if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
																break _v0$2;
															} else {
																if ((repr.a.b.a.$ === 6) && (repr.a.b.a.a === 1)) {
																	break _v0$3;
																} else {
																	break _v0$6;
																}
															}
														}
													}
												case 2:
													if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
														break _v0$0;
													} else {
														if ((repr.a.a.a.$ === 6) && (repr.a.a.a.a === 1)) {
															break _v0$1;
														} else {
															if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
																break _v0$5;
															} else {
																break _v0$6;
															}
														}
													}
												default:
													if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
														break _v0$0;
													} else {
														if ((repr.a.a.a.$ === 6) && (repr.a.a.a.a === 1)) {
															break _v0$1;
														} else {
															break _v0$6;
														}
													}
											}
										case 2:
											switch (repr.a.b.$) {
												case 0:
													if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
														break _v0$2;
													} else {
														if ((repr.a.b.a.$ === 6) && (repr.a.b.a.a === 1)) {
															break _v0$3;
														} else {
															if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
																break _v0$4;
															} else {
																break _v0$6;
															}
														}
													}
												case 2:
													if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
														break _v0$4;
													} else {
														if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
															break _v0$5;
														} else {
															break _v0$6;
														}
													}
												default:
													if ((repr.a.a.b.$ === 6) && (repr.a.a.b.a === 1)) {
														break _v0$4;
													} else {
														break _v0$6;
													}
											}
										default:
											switch (repr.a.b.$) {
												case 0:
													if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
														break _v0$2;
													} else {
														if ((repr.a.b.a.$ === 6) && (repr.a.b.a.a === 1)) {
															break _v0$3;
														} else {
															break _v0$6;
														}
													}
												case 2:
													if ((repr.a.b.b.$ === 6) && (repr.a.b.b.a === 1)) {
														break _v0$5;
													} else {
														break _v0$6;
													}
												default:
													break _v0$6;
											}
									}
								} else {
									break _v0$6;
								}
							}
							return $elm$core$Maybe$Nothing;
						}
						var _v11 = repr.a;
						var e1 = _v11.a;
						var _v12 = _v11.b;
						var e2 = _v12.a;
						return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
							_List_fromArray(
								[
									$author$project$Netherite$TriR(
									A2(
										$author$project$Equation$Sub,
										e2,
										$author$project$Equation$Literal(1)))
								])) : $elm$core$Maybe$Nothing;
					}
					var _v9 = repr.a;
					var _v10 = _v9.a;
					var e1 = _v10.a;
					var e2 = _v9.b;
					return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
						_List_fromArray(
							[
								$author$project$Netherite$TriR(
								A2(
									$author$project$Equation$Sub,
									e1,
									$author$project$Equation$Literal(1)))
							])) : $elm$core$Maybe$Nothing;
				}
				var _v7 = repr.a;
				var e1 = _v7.a;
				var _v8 = _v7.b;
				var e2 = _v8.b;
				return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
					_List_fromArray(
						[
							$author$project$Netherite$TriR(e1)
						])) : $elm$core$Maybe$Nothing;
			}
			var _v5 = repr.a;
			var e1 = _v5.a;
			var _v6 = _v5.b;
			var e2 = _v6.a;
			return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
				_List_fromArray(
					[
						$author$project$Netherite$TriR(e1)
					])) : $elm$core$Maybe$Nothing;
		}
		var _v3 = repr.a;
		var _v4 = _v3.a;
		var e1 = _v4.b;
		var e2 = _v3.b;
		return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
			_List_fromArray(
				[
					$author$project$Netherite$TriR(e1)
				])) : $elm$core$Maybe$Nothing;
	}
	var _v1 = repr.a;
	var _v2 = _v1.a;
	var e1 = _v2.a;
	var e2 = _v1.b;
	return _Utils_eq(e1, e2) ? $elm$core$Maybe$Just(
		_List_fromArray(
			[
				$author$project$Netherite$TriR(e1)
			])) : $elm$core$Maybe$Nothing;
};
var $author$project$Equation$Mul = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Netherite$RectR = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Netherite$mulRepr = F2(
	function (r1, r2) {
		var _v0 = _Utils_Tuple2(r1, r2);
		_v0$0:
		while (true) {
			_v0$1:
			while (true) {
				_v0$3:
				while (true) {
					if (_v0.a.b && (!_v0.a.b.b)) {
						if (_v0.b.b && (!_v0.b.b.b)) {
							switch (_v0.a.a.$) {
								case 0:
									break _v0$0;
								case 1:
									switch (_v0.b.a.$) {
										case 0:
											break _v0$1;
										case 1:
											var _v5 = _v0.a;
											var e1 = _v5.a.a;
											var _v6 = _v0.b;
											var e2 = _v6.a.a;
											return _List_fromArray(
												[
													_List_fromArray(
													[
														A2($author$project$Netherite$RectR, e1, e2)
													]),
													_List_fromArray(
													[
														$author$project$Netherite$LineR(
														A2($author$project$Equation$Mul, e1, e2))
													])
												]);
										default:
											break _v0$3;
									}
								default:
									if (!_v0.b.a.$) {
										break _v0$1;
									} else {
										break _v0$3;
									}
							}
						} else {
							if (!_v0.a.a.$) {
								break _v0$0;
							} else {
								break _v0$3;
							}
						}
					} else {
						if ((_v0.b.b && (!_v0.b.a.$)) && (!_v0.b.b.b)) {
							break _v0$1;
						} else {
							break _v0$3;
						}
					}
				}
				return _List_Nil;
			}
			var _v3 = _v0.b;
			var _v4 = _v3.a;
			return _List_fromArray(
				[r1]);
		}
		var _v1 = _v0.a;
		var _v2 = _v1.a;
		return _List_fromArray(
			[r2]);
	});
var $author$project$Netherite$isLineR = function (s) {
	switch (s.$) {
		case 1:
			return true;
		case 6:
			return true;
		case 7:
			return true;
		default:
			return false;
	}
};
var $author$project$Netherite$doSub = F2(
	function (subE, _v0) {
		doSub:
		while (true) {
			var r1 = _v0.a;
			var r2 = _v0.b;
			if (r1.b) {
				switch (r1.a.$) {
					case 1:
						var e = r1.a.a;
						var xs = r1.b;
						return $elm$core$Maybe$Just(
							A2(
								$elm$core$List$cons,
								$author$project$Netherite$LineR(
									A2($author$project$Equation$Sub, e, subE)),
								_Utils_ap(xs, r2)));
					case 6:
						var sr = r1.a.a;
						var xs = r1.b;
						return A2(
							$elm$core$Maybe$map,
							function (r) {
								return A2(
									$elm$core$List$cons,
									$author$project$Netherite$SumR(
										_Utils_update(
											sr,
											{
												aB: A2(
													$author$project$Equation$Sub,
													sr.aB,
													$author$project$Equation$Literal(1))
											})),
									_Utils_ap(
										r,
										_Utils_ap(xs, r2)));
							},
							A2(
								$author$project$Netherite$doSub,
								subE,
								A2($elm$core$List$partition, $author$project$Netherite$isLineR, sr.bq)));
					case 7:
						var _v2 = r1.a;
						var e = _v2.a;
						var rr = _v2.b;
						var xs = r1.b;
						return A2(
							$elm$core$Maybe$map,
							function (r) {
								return A2(
									$elm$core$List$cons,
									A2(
										$author$project$Netherite$RepeatRp,
										A2(
											$author$project$Equation$Sub,
											e,
											$author$project$Equation$Literal(1)),
										rr),
									_Utils_ap(
										r,
										_Utils_ap(xs, r2)));
							},
							A2(
								$author$project$Netherite$doSub,
								subE,
								A2($elm$core$List$partition, $author$project$Netherite$isLineR, rr)));
					default:
						var x = r1.a;
						var xs = r1.b;
						var $temp$subE = subE,
							$temp$_v0 = _Utils_Tuple2(
							xs,
							A2($elm$core$List$cons, x, r2));
						subE = $temp$subE;
						_v0 = $temp$_v0;
						continue doSub;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $elm_community$maybe_extra$Maybe$Extra$toList = function (m) {
	if (m.$ === 1) {
		return _List_Nil;
	} else {
		var x = m.a;
		return _List_fromArray(
			[x]);
	}
};
var $author$project$Netherite$subRepr = F2(
	function (r1, r2) {
		var _default = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				$elm$core$List$singleton,
				A2($author$project$Util$subtractList, r1, r2)));
		var _v0 = _Utils_Tuple2(r1, r2);
		_v0$2:
		while (true) {
			if (_v0.b.b && (!_v0.b.b.b)) {
				switch (_v0.b.a.$) {
					case 0:
						var _v1 = _v0.b;
						var _v2 = _v1.a;
						return _Utils_ap(
							$elm_community$maybe_extra$Maybe$Extra$toList(
								A2(
									$author$project$Netherite$doSub,
									$author$project$Equation$Literal(1),
									A2($elm$core$List$partition, $author$project$Netherite$isLineR, r1))),
							_default);
					case 1:
						var _v3 = _v0.b;
						var e = _v3.a.a;
						return _Utils_ap(
							$elm_community$maybe_extra$Maybe$Extra$toList(
								A2(
									$author$project$Netherite$doSub,
									e,
									A2($elm$core$List$partition, $author$project$Netherite$isLineR, r1))),
							_default);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return _default;
	});
var $author$project$Netherite$representations = function (expr) {
	representations:
	while (true) {
		_v0$14:
		while (true) {
			switch (expr.$) {
				case 6:
					if (expr.a === 1) {
						return _List_fromArray(
							[
								_List_fromArray(
								[$author$project$Netherite$DotR])
							]);
					} else {
						var i = expr.a;
						return _List_fromArray(
							[
								_List_fromArray(
								[
									$author$project$Netherite$LineR(
									$author$project$Equation$Literal(i))
								])
							]);
					}
				case 5:
					var name = expr.a;
					return _List_fromArray(
						[
							_List_fromArray(
							[
								$author$project$Netherite$LineR(
								$author$project$Equation$Var(name))
							])
						]);
				case 0:
					var e1 = expr.a;
					var e2 = expr.b;
					return A2(
						$elm$core$List$concatMap,
						function (i) {
							return A2(
								$elm$core$List$concatMap,
								$author$project$Netherite$addRepr(i),
								$author$project$Netherite$representations(e1));
						},
						$author$project$Netherite$representations(e2));
				case 1:
					var e1 = expr.a;
					var e2 = expr.b;
					return _Utils_ap(
						A2(
							$elm$core$List$map,
							function (r) {
								return _List_fromArray(
									[
										A2($author$project$Netherite$RepeatRp, e1, r)
									]);
							},
							$author$project$Netherite$representations(e2)),
						_Utils_ap(
							A2(
								$elm$core$List$map,
								function (r) {
									return _List_fromArray(
										[
											A2($author$project$Netherite$RepeatRp, e2, r)
										]);
								},
								$author$project$Netherite$representations(e1)),
							A2(
								$elm$core$List$concatMap,
								function (i) {
									return A2(
										$elm$core$List$concatMap,
										$author$project$Netherite$mulRepr(i),
										$author$project$Netherite$representations(e1));
								},
								$author$project$Netherite$representations(e2))));
				case 2:
					if (((((expr.a.$ === 1) && (expr.a.a.$ === 6)) && (expr.a.a.a === 2)) && (expr.b.$ === 6)) && (expr.b.a === 1)) {
						var _v1 = expr.a;
						var e = _v1.b;
						return _List_fromArray(
							[
								_List_fromArray(
								[
									$author$project$Netherite$LR(e)
								])
							]);
					} else {
						var e1 = expr.a;
						var e2 = expr.b;
						return A2(
							$elm$core$List$concatMap,
							function (i) {
								return A2(
									$elm$core$List$concatMap,
									$author$project$Netherite$subRepr(i),
									$author$project$Netherite$representations(e2));
							},
							$author$project$Netherite$representations(e1));
					}
				case 3:
					if (expr.b.$ === 6) {
						switch (expr.b.a) {
							case 1:
								var e = expr.a;
								var $temp$expr = e;
								expr = $temp$expr;
								continue representations;
							case 2:
								var e = expr.a;
								return A2(
									$elm$core$List$filterMap,
									$author$project$Netherite$div2Repr,
									$author$project$Netherite$representations(e));
							default:
								break _v0$14;
						}
					} else {
						break _v0$14;
					}
				case 4:
					if (expr.b.$ === 6) {
						switch (expr.b.a) {
							case 1:
								var e = expr.a;
								var $temp$expr = e;
								expr = $temp$expr;
								continue representations;
							case 2:
								var e = expr.a;
								return _List_fromArray(
									[
										_List_fromArray(
										[
											$author$project$Netherite$SquareR(e)
										])
									]);
							default:
								break _v0$14;
						}
					} else {
						break _v0$14;
					}
				case 7:
					var sumExpr = expr.a;
					var _var = sumExpr.a4;
					var start = sumExpr.au;
					var end = sumExpr.aB;
					return A2(
						$elm$core$List$map,
						function (r) {
							return _List_fromArray(
								[
									$author$project$Netherite$SumR(
									{aB: end, bq: r, au: start, a4: _var})
								]);
						},
						$author$project$Netherite$representations(sumExpr.aE));
				case 8:
					var e = expr.a;
					return _List_fromArray(
						[
							_List_fromArray(
							[
								$author$project$Netherite$LineR(
								$author$project$Equation$Fib(e))
							])
						]);
				default:
					var e = expr.a;
					return _List_fromArray(
						[
							_List_fromArray(
							[
								$author$project$Netherite$TriR(e)
							])
						]);
			}
		}
		return _List_Nil;
	}
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Discover$validStartRepr = function (repr) {
	if (repr.b && (!repr.b.b)) {
		var shape = repr.a;
		switch (shape.$) {
			case 6:
				return false;
			case 7:
				return false;
			default:
				return true;
		}
	} else {
		return false;
	}
};
var $author$project$Discover$discover = F3(
	function (_v0, n1, n2) {
		var e1 = _v0.a;
		var e2 = _v0.b;
		var smallN = A2($elm$core$Basics$min, n1, n2);
		var rRep = $author$project$Netherite$representations(e1);
		var lRep = $author$project$Netherite$representations(e2);
		var bigN = A2($elm$core$Basics$max, n1, n2);
		var possible = A2(
			$elm$core$List$filter,
			A2($author$project$Heuristics$isValidPair, smallN, bigN),
			_Utils_ap(
				A2(
					$elm$core$List$concatMap,
					function (a) {
						return A2(
							$elm$core$List$map,
							function (b) {
								return _Utils_Tuple2(a, b);
							},
							lRep);
					},
					A2($elm$core$List$filter, $author$project$Discover$validStartRepr, rRep)),
				A2(
					$elm$core$List$concatMap,
					function (a) {
						return A2(
							$elm$core$List$map,
							function (b) {
								return _Utils_Tuple2(a, b);
							},
							rRep);
					},
					A2($elm$core$List$filter, $author$project$Discover$validStartRepr, lRep))));
		var _v1 = A2(
			$elm$core$List$partition,
			A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $author$project$Heuristics$isRecursive),
			possible);
		var recursivePairs = _v1.a;
		var constantPairs = _v1.b;
		var _v2 = A3(
			$author$project$Discover$discoverRecursive,
			A2(
				$elm$core$List$sortBy,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$core$List$length),
				recursivePairs),
			smallN,
			bigN);
		if (!_v2.$) {
			var proof = _v2.a;
			return $elm$core$Maybe$Just(proof);
		} else {
			return A3(
				$author$project$Discover$discoverProof,
				A2(
					$elm$core$List$sortBy,
					function (_v3) {
						var _v4 = _v3.b;
						var a = _v4.b;
						var _v5 = _v3.c;
						var b = _v5.b;
						return $elm$core$List$length(a) * $elm$core$List$length(b);
					},
					A2(
						$elm$core$List$filterMap,
						A2($author$project$Discover$buildGoal, bigN, smallN),
						constantPairs)),
				bigN,
				smallN);
		}
	});
var $author$project$Generalise$evaluateProof = F3(
	function (n, start, schematic) {
		var step = schematic.aj;
		var base = schematic.ah;
		var evalP = function (p) {
			var _v33 = _Utils_Tuple2(start, p);
			_v33$5:
			while (true) {
				switch (_v33.a.$) {
					case 0:
						if (!_v33.b.$) {
							var s1 = _v33.a.a;
							var s2 = _v33.b.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Generalise$SOp,
								A4($author$project$Generalise$evaluateProofS, n, s1, s2, schematic));
						} else {
							break _v33$5;
						}
					case 1:
						if (_v33.b.$ === 1) {
							var r1 = _v33.a.a;
							var r2 = _v33.b.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Generalise$ROp,
								A4($author$project$Generalise$evaluateProofR, n, r1, r2, schematic));
						} else {
							break _v33$5;
						}
					case 2:
						if (_v33.b.$ === 2) {
							var f1 = _v33.a.a;
							var f2 = _v33.b.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Generalise$FOp,
								A4($author$project$Generalise$evaluateProofF, n, f1, f2, schematic));
						} else {
							break _v33$5;
						}
					case 3:
						if (_v33.b.$ === 3) {
							var t1 = _v33.a.a;
							var t2 = _v33.b.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Generalise$TOp,
								A4($author$project$Generalise$evaluateProofT, n, t1, t2, schematic));
						} else {
							break _v33$5;
						}
					default:
						if (_v33.b.$ === 4) {
							var l1 = _v33.a.a;
							var l2 = _v33.b.a;
							return A2(
								$elm$core$Maybe$map,
								$author$project$Generalise$LOp,
								A4($author$project$Generalise$evaluateProofL, n, l1, l2, schematic));
						} else {
							break _v33$5;
						}
				}
			}
			return $elm$core$Maybe$Nothing;
		};
		return A2(
			$author$project$Generalise$ifFailed,
			evalP(base),
			A2(
				$elm$core$Maybe$andThen,
				evalP,
				A2($author$project$Generalise$buildRepeat, n, step)));
	});
var $author$project$Generalise$evaluateProofF = F4(
	function (m, shape, step, schematic) {
		var _v26 = _Utils_Tuple2(shape, step);
		_v26$3:
		while (true) {
			if (_v26.a.$ === 1) {
				switch (_v26.b.$) {
					case 0:
						var _v27 = _v26.a;
						var n1 = _v27.a;
						var n2 = _v27.b;
						var _v28 = _v26.b;
						var r1 = _v28.a;
						var r2 = _v28.b;
						var r3 = _v28.c;
						var r4 = _v28.d;
						return A5(
							$elm$core$Maybe$map4,
							$author$project$Generalise$SplitFrame,
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n1 - n2, n2),
								r1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n1 - n2, n2),
								r2,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n2, n1 - n2),
								r3,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n2, n1 - n2),
								r4,
								schematic));
					case 1:
						var _v29 = _v26.a;
						var n1 = _v29.a;
						var n2 = _v29.b;
						var _v30 = _v26.b;
						return $elm$core$Maybe$Just(
							A2($author$project$Generalise$Frame, n1, n2));
					case 2:
						var _v31 = _v26.a;
						var n1 = _v31.a;
						var n2 = _v31.b;
						var _v32 = _v26.b;
						return A2(
							$elm$core$Maybe$andThen,
							$author$project$Generalise$unwrapF,
							A3(
								$author$project$Generalise$evaluateProof,
								m - 1,
								$author$project$Generalise$FOp(
									A2($author$project$Generalise$Frame, n1, n2)),
								schematic));
					default:
						break _v26$3;
				}
			} else {
				break _v26$3;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$evaluateProofL = F4(
	function (m, shape, step, schematic) {
		var _v23 = _Utils_Tuple2(shape, step);
		_v23$3:
		while (true) {
			if (_v23.a.$ === 1) {
				switch (_v23.b.$) {
					case 0:
						var n = _v23.a.a;
						var _v24 = _v23.b;
						var r = _v24.a;
						var l = _v24.b;
						return (n > 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitEnds,
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, 1, 2),
								r,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofL,
								m,
								$author$project$Generalise$L(n - 1),
								l,
								schematic)) : $elm$core$Maybe$Nothing;
					case 1:
						var n = _v23.a.a;
						return $elm$core$Maybe$Just(
							$author$project$Generalise$L(n));
					case 2:
						var n = _v23.a.a;
						var _v25 = _v23.b;
						return A2(
							$elm$core$Maybe$andThen,
							$author$project$Generalise$unwrapL,
							A3(
								$author$project$Generalise$evaluateProof,
								m - 1,
								$author$project$Generalise$LOp(
									$author$project$Generalise$L(n)),
								schematic));
					default:
						break _v23$3;
				}
			} else {
				break _v23$3;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$evaluateProofR = F4(
	function (m, shape, step, schematic) {
		var _v12 = _Utils_Tuple2(shape, step);
		_v12$6:
		while (true) {
			if (_v12.a.$ === 4) {
				switch (_v12.b.$) {
					case 1:
						var _v13 = _v12.a;
						var n1 = _v13.a;
						var n2 = _v13.b;
						var _v14 = _v12.b;
						var t1 = _v14.a;
						var t2 = _v14.b;
						return ((n1 - n2) === 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitDiaR,
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n2),
								t1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n2),
								t2,
								schematic)) : (((n2 - n1) === 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitDiaR,
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n1),
								t1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n1),
								t2,
								schematic)) : $elm$core$Maybe$Nothing);
					case 0:
						var _v15 = _v12.a;
						var n1 = _v15.a;
						var n2 = _v15.b;
						var _v16 = _v12.b;
						var s = _v16.a;
						var r = _v16.b;
						return (_Utils_cmp(n1, n2) > 0) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitSquare,
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n2),
								s,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n1 - n2, n2),
								r,
								schematic)) : ((_Utils_cmp(n2, n1) > 0) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitSquare,
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n1),
								s,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n1, n2 - n1),
								r,
								schematic)) : $elm$core$Maybe$Nothing);
					case 2:
						var _v17 = _v12.a;
						var n1 = _v17.a;
						var n2 = _v17.b;
						var s = _v12.b.a;
						return _Utils_eq(n1, n2) ? A2(
							$elm$core$Maybe$map,
							$author$project$Generalise$ToSquare,
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n1),
								s,
								schematic)) : $elm$core$Maybe$Nothing;
					case 3:
						var _v18 = _v12.a;
						var n1 = _v18.a;
						var n2 = _v18.b;
						var r = _v12.b.a;
						return A2(
							$elm$core$Maybe$map,
							$author$project$Generalise$Rotate,
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, n2, n1),
								r,
								schematic));
					case 4:
						var _v19 = _v12.a;
						var n1 = _v19.a;
						var n2 = _v19.b;
						var _v20 = _v12.b;
						return $elm$core$Maybe$Just(
							A2($author$project$Generalise$Rect, n1, n2));
					case 5:
						var _v21 = _v12.a;
						var n1 = _v21.a;
						var n2 = _v21.b;
						var _v22 = _v12.b;
						return A2(
							$elm$core$Maybe$andThen,
							$author$project$Generalise$unwrapR,
							A3(
								$author$project$Generalise$evaluateProof,
								m - 1,
								$author$project$Generalise$ROp(
									A2($author$project$Generalise$Rect, n1, n2)),
								schematic));
					default:
						break _v12$6;
				}
			} else {
				break _v12$6;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$evaluateProofS = F4(
	function (m, shape, step, schematic) {
		var _v5 = _Utils_Tuple2(shape, step);
		_v5$7:
		while (true) {
			if (_v5.a.$ === 5) {
				switch (_v5.b.$) {
					case 0:
						var n = _v5.a.a;
						var _v6 = _v5.b;
						var l = _v6.a;
						var s = _v6.b;
						return (n > 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$LCutS,
							A4(
								$author$project$Generalise$evaluateProofL,
								m,
								$author$project$Generalise$L(n),
								l,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n - 1),
								s,
								schematic)) : $elm$core$Maybe$Nothing;
					case 4:
						var n = _v5.a.a;
						var _v7 = _v5.b;
						var t1 = _v7.a;
						var t2 = _v7.b;
						return (n > 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitDiaS,
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n),
								t1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n - 1),
								t2,
								schematic)) : $elm$core$Maybe$Nothing;
					case 2:
						var n = _v5.a.a;
						var _v8 = _v5.b;
						var f = _v8.a;
						var s = _v8.b;
						return (n >= 3) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitOuterFrame,
							A4(
								$author$project$Generalise$evaluateProofF,
								m,
								A2($author$project$Generalise$Frame, n, 1),
								f,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n - 2),
								s,
								schematic)) : $elm$core$Maybe$Nothing;
					case 1:
						var n = _v5.a.a;
						var _v9 = _v5.b;
						var f = _v9.a;
						var s = _v9.b;
						return (n >= 3) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitInnerSquare,
							A4(
								$author$project$Generalise$evaluateProofF,
								m,
								A2($author$project$Generalise$Frame, n, ((n - 1) / 2) | 0),
								f,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n - (2 * (((n - 1) / 2) | 0))),
								s,
								schematic)) : $elm$core$Maybe$Nothing;
					case 3:
						var n = _v5.a.a;
						var _v10 = _v5.b;
						var s1 = _v10.a;
						var s2 = _v10.b;
						var s3 = _v10.c;
						var s4 = _v10.d;
						return ((n >= 2) && (!A2($elm$core$Basics$modBy, 2, n))) ? A5(
							$elm$core$Maybe$map4,
							$author$project$Generalise$Split4,
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square((n / 2) | 0),
								s1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square((n / 2) | 0),
								s2,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square((n / 2) | 0),
								s3,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square((n / 2) | 0),
								s4,
								schematic)) : $elm$core$Maybe$Nothing;
					case 5:
						var n = _v5.a.a;
						return $elm$core$Maybe$Just(
							$author$project$Generalise$Square(n));
					case 6:
						var n = _v5.a.a;
						var _v11 = _v5.b;
						return A2(
							$elm$core$Maybe$andThen,
							$author$project$Generalise$unwrapS,
							A3(
								$author$project$Generalise$evaluateProof,
								m - 1,
								$author$project$Generalise$SOp(
									$author$project$Generalise$Square(n)),
								schematic));
					default:
						break _v5$7;
				}
			} else {
				break _v5$7;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $author$project$Generalise$evaluateProofT = F4(
	function (m, shape, step, schematic) {
		var _v0 = _Utils_Tuple2(shape, step);
		_v0$5:
		while (true) {
			if (_v0.a.$ === 3) {
				switch (_v0.b.$) {
					case 0:
						var n = _v0.a.a;
						var _v1 = _v0.b;
						var t1 = _v1.a;
						var s = _v1.b;
						var t2 = _v1.c;
						return (n > 1) ? A4(
							$elm$core$Maybe$map3,
							$author$project$Generalise$SplitTST,
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri((n / 2) | 0),
								t1,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofS,
								m,
								$author$project$Generalise$Square(n - ((n / 2) | 0)),
								s,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri((n / 2) | 0),
								t2,
								schematic)) : $elm$core$Maybe$Nothing;
					case 1:
						var n = _v0.a.a;
						var _v2 = _v0.b;
						var l = _v2.a;
						var t = _v2.b;
						return (n > 2) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$LCutT,
							A4(
								$author$project$Generalise$evaluateProofL,
								m,
								$author$project$Generalise$L(n),
								l,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n - 2),
								t,
								schematic)) : $elm$core$Maybe$Nothing;
					case 2:
						var n = _v0.a.a;
						var _v3 = _v0.b;
						var r = _v3.a;
						var t = _v3.b;
						return (n > 1) ? A3(
							$elm$core$Maybe$map2,
							$author$project$Generalise$SplitSide,
							A4(
								$author$project$Generalise$evaluateProofR,
								m,
								A2($author$project$Generalise$Rect, 1, n),
								r,
								schematic),
							A4(
								$author$project$Generalise$evaluateProofT,
								m,
								$author$project$Generalise$Tri(n - 1),
								t,
								schematic)) : $elm$core$Maybe$Nothing;
					case 3:
						var n = _v0.a.a;
						return $elm$core$Maybe$Just(
							$author$project$Generalise$Tri(n));
					case 4:
						var n = _v0.a.a;
						var _v4 = _v0.b;
						return A2(
							$elm$core$Maybe$andThen,
							$author$project$Generalise$unwrapT,
							A3(
								$author$project$Generalise$evaluateProof,
								m - 1,
								$author$project$Generalise$TOp(
									$author$project$Generalise$Tri(n)),
								schematic));
					default:
						break _v0$5;
				}
			} else {
				break _v0$5;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Discover$eval = F2(
	function (sp, n) {
		var _v0 = A2(
			$author$project$Generalise$repr2Goal,
			$elm$core$Dict$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2('n', n)
					])),
			_List_fromArray(
				[sp.a]));
		if (((!_v0.$) && _v0.a.b) && (!_v0.a.b.b)) {
			var _v1 = _v0.a;
			var start = _v1.a;
			return A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$pair(start),
				A3($author$project$Generalise$evaluateProof, n, start, sp.b));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {az: col, bd: contextStack, aS: problem, aZ: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.aZ, s.az, x, s.j));
	});
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.e),
			s.f) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $author$project$Equation$Div = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Equation$Pow = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Equation$Sum = function (a) {
	return {$: 7, a: a};
};
var $author$project$Equation$SumExpr = F4(
	function (_var, start, end, expr) {
		return {aB: end, aE: expr, au: start, a4: _var};
	});
var $author$project$Equation$Tri = function (a) {
	return {$: 9, a: a};
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $author$project$Equation$fixDivAssoc = function (divExpr) {
	var helper = F2(
		function (e, acc) {
			helper:
			while (true) {
				if (e.$ === 3) {
					var intA = e.a;
					var intB = e.b;
					var $temp$e = intB,
						$temp$acc = $author$project$Equation$Div(
						acc(intA));
					e = $temp$e;
					acc = $temp$acc;
					continue helper;
				} else {
					return acc(e);
				}
			}
		});
	return A2(helper, divExpr, $elm$core$Basics$identity);
};
var $author$project$Equation$fixSubAssoc = function (subExpr) {
	var helper = F2(
		function (e, acc) {
			helper:
			while (true) {
				if (e.$ === 2) {
					var intA = e.a;
					var intB = e.b;
					var $temp$e = intB,
						$temp$acc = $author$project$Equation$Sub(
						acc(intA));
					e = $temp$e;
					acc = $temp$acc;
					continue helper;
				} else {
					return acc(e);
				}
			}
		});
	return A2(helper, subExpr, $elm$core$Basics$identity);
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$ExpectingKeyword = function (a) {
	return {$: 9, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$keyword = function (_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(kwd);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, kwd, s.f, s.aZ, s.az, s.e);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return (_Utils_eq(newOffset, -1) || (0 <= A3(
			$elm$parser$Parser$Advanced$isSubChar,
			function (c) {
				return $elm$core$Char$isAlphaNum(c) || (c === '_');
			},
			newOffset,
			s.e))) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{az: newCol, j: s.j, m: s.m, f: newOffset, aZ: newRow, e: s.e});
	};
};
var $elm$parser$Parser$keyword = function (kwd) {
	return $elm$parser$Parser$Advanced$keyword(
		A2(
			$elm$parser$Parser$Advanced$Token,
			kwd,
			$elm$parser$Parser$ExpectingKeyword(kwd)));
};
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.e);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.f, offset) < 0,
					0,
					{az: col, j: s0.j, m: s0.m, f: offset, aZ: row, e: s0.e});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.f, s.aZ, s.az, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $author$project$Equation$whitespace = $elm$parser$Parser$chompWhile(
	function (c) {
		return (c === ' ') || ((c === '\n') || ((c === '\r') || (c === '\t')));
	});
var $author$project$Equation$lexeme = function (parser) {
	return A2($elm$parser$Parser$ignorer, parser, $author$project$Equation$whitespace);
};
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {az: s.az + (newOffset - s.f), j: s.j, m: s.m, f: newOffset, aZ: s.aZ, e: s.e};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.f, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.e);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.aZ, s.az - (floatOffset + s.f), invalid, s.j));
		} else {
			if (_Utils_eq(s.f, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.f, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.f, floatOffset, s.e));
						if (_v1.$ === 1) {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.f, s.e)) {
			var zeroOffset = s.f + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.e) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.bl,
				c.aI,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.e),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.e) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.bl,
				c.aO,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.e),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.e) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.bl,
				c.ax,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.e),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.bl,
				c.aD,
				c.aK,
				c.aF,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.bl,
				c.aD,
				c.aK,
				c.aF,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.f, s.e),
				s);
		}
	};
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				ax: $elm$core$Result$Err(invalid),
				aD: expecting,
				aF: $elm$core$Result$Err(invalid),
				aI: $elm$core$Result$Err(invalid),
				aK: $elm$core$Result$Ok($elm$core$Basics$identity),
				bl: invalid,
				aO: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $author$project$Equation$literal = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($author$project$Equation$Literal),
	$author$project$Equation$lexeme($elm$parser$Parser$int));
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 8, a: a};
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.f, s.aZ, s.az, s.e);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{az: newCol, j: s.j, m: s.m, f: newOffset, aZ: newRow, e: s.e});
	};
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $author$project$Equation$VarName = $elm$core$Basics$identity;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$parser$Parser$ExpectingVariable = {$: 7};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {az: col, j: context, m: indent, f: offset, aZ: row, e: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return function (s) {
		var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.au, s.f, s.e);
		if (_Utils_eq(firstOffset, -1)) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, i.aD));
		} else {
			var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.bk, s.f + 1, s.aZ + 1, 1, s.e, s.m, s.j) : A7($elm$parser$Parser$Advanced$varHelp, i.bk, firstOffset, s.aZ, s.az + 1, s.e, s.m, s.j);
			var name = A3($elm$core$String$slice, s.f, s1.f, s.e);
			return A2($elm$core$Set$member, name, i.br) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, i.aD)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
		}
	};
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{aD: $elm$parser$Parser$ExpectingVariable, bk: i.bk, br: i.br, au: i.au});
};
var $author$project$Equation$varName = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($elm$core$Basics$identity),
	A2(
		$elm$parser$Parser$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$uncons,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map(
					A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$parser$Parser$succeed)),
				$elm$core$Maybe$withDefault(
					$elm$parser$Parser$problem('This should never happen (There\'s a variable with the empty string as its name??)')))),
		$elm$parser$Parser$variable(
			{
				bk: $elm$core$Basics$always(false),
				br: $elm$core$Set$empty,
				au: $elm$core$Char$isLower
			})));
var $author$project$Equation$var_ = A2(
	$elm$parser$Parser$keeper,
	$elm$parser$Parser$succeed($author$project$Equation$Var),
	$author$project$Equation$varName);
var $author$project$Equation$add = function (t) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$author$project$Equation$Add(t)),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('+')),
		$elm$parser$Parser$lazy(
			function (_v9) {
				return $author$project$Equation$intExpr(true);
			}));
};
var $author$project$Equation$div = function (t) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$author$project$Equation$Div(t)),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('/')),
		$elm$parser$Parser$lazy(
			function (_v8) {
				return $author$project$Equation$mulExpr(false);
			}));
};
var $author$project$Equation$intExpr = function (reverse) {
	return A2(
		$elm$parser$Parser$map,
		reverse ? $author$project$Equation$fixSubAssoc : $elm$core$Basics$identity,
		A2(
			$elm$parser$Parser$andThen,
			function (t) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$author$project$Equation$add(t),
							$author$project$Equation$sub(t),
							$elm$parser$Parser$succeed(t)
						]));
			},
			$author$project$Equation$lexeme(
				$author$project$Equation$mulExpr(true))));
};
var $author$project$Equation$mul = function (t) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$author$project$Equation$Mul(t)),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('*')),
		$elm$parser$Parser$lazy(
			function (_v6) {
				return $author$project$Equation$mulExpr(true);
			}));
};
var $author$project$Equation$mulExpr = function (reverse) {
	return A2(
		$elm$parser$Parser$map,
		reverse ? $author$project$Equation$fixDivAssoc : $elm$core$Basics$identity,
		A2(
			$elm$parser$Parser$andThen,
			function (t) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							$author$project$Equation$mul(t),
							$author$project$Equation$div(t),
							$elm$parser$Parser$succeed(t)
						]));
			},
			$author$project$Equation$lexeme(
				$author$project$Equation$cyclic$powTerm())));
};
var $author$project$Equation$pow = function (t) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$author$project$Equation$Pow(t)),
					A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('^')),
				$author$project$Equation$lexeme(
					$author$project$Equation$cyclic$powTerm())),
				$elm$parser$Parser$succeed(t)
			]));
};
var $author$project$Equation$sub = function (t) {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(
				$author$project$Equation$Sub(t)),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('-')),
		$elm$parser$Parser$lazy(
			function (_v4) {
				return $author$project$Equation$intExpr(false);
			}));
};
function $author$project$Equation$cyclic$powTerm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				$author$project$Equation$pow,
				$author$project$Equation$lexeme(
					$author$project$Equation$cyclic$term()))
			]));
}
function $author$project$Equation$cyclic$term() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$author$project$Equation$cyclic$paren(),
				$author$project$Equation$literal,
				$author$project$Equation$var_,
				$author$project$Equation$cyclic$tri(),
				$author$project$Equation$cyclic$fib(),
				$author$project$Equation$cyclic$sum()
			]));
}
function $author$project$Equation$cyclic$fib() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Equation$Fib),
				A2($elm$core$Basics$composeR, $elm$parser$Parser$keyword, $author$project$Equation$lexeme)('Fib')),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('(')),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$lazy(
				function (_v7) {
					return $author$project$Equation$intExpr(true);
				}),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(')')));
}
function $author$project$Equation$cyclic$paren() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('(')),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$lazy(
				function (_v5) {
					return $author$project$Equation$intExpr(true);
				}),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(')')));
}
function $author$project$Equation$cyclic$sum() {
	return A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($author$project$Equation$Sum),
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$ignorer,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($author$project$Equation$SumExpr),
								A2($elm$core$Basics$composeR, $elm$parser$Parser$keyword, $author$project$Equation$lexeme)('Sum')),
							A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('(')),
						A2(
							$elm$parser$Parser$ignorer,
							$author$project$Equation$lexeme($author$project$Equation$varName),
							A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(','))),
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$lazy(
							function (_v1) {
								return $author$project$Equation$intExpr(true);
							}),
						A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(','))),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$lazy(
						function (_v2) {
							return $author$project$Equation$intExpr(true);
						}),
					A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(','))),
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$lazy(
					function (_v3) {
						return $author$project$Equation$intExpr(true);
					}),
				A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(')'))));
}
function $author$project$Equation$cyclic$tri() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($author$project$Equation$Tri),
				A2($elm$core$Basics$composeR, $elm$parser$Parser$keyword, $author$project$Equation$lexeme)('Tri')),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('(')),
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$lazy(
				function (_v0) {
					return $author$project$Equation$intExpr(true);
				}),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)(')')));
}
var $author$project$Equation$powTerm = $author$project$Equation$cyclic$powTerm();
$author$project$Equation$cyclic$powTerm = function () {
	return $author$project$Equation$powTerm;
};
var $author$project$Equation$term = $author$project$Equation$cyclic$term();
$author$project$Equation$cyclic$term = function () {
	return $author$project$Equation$term;
};
var $author$project$Equation$fib = $author$project$Equation$cyclic$fib();
$author$project$Equation$cyclic$fib = function () {
	return $author$project$Equation$fib;
};
var $author$project$Equation$paren = $author$project$Equation$cyclic$paren();
$author$project$Equation$cyclic$paren = function () {
	return $author$project$Equation$paren;
};
var $author$project$Equation$sum = $author$project$Equation$cyclic$sum();
$author$project$Equation$cyclic$sum = function () {
	return $author$project$Equation$sum;
};
var $author$project$Equation$tri = $author$project$Equation$cyclic$tri();
$author$project$Equation$cyclic$tri = function () {
	return $author$project$Equation$tri;
};
var $author$project$Equation$equation = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Tuple$pair),
		A2(
			$elm$parser$Parser$ignorer,
			$author$project$Equation$lexeme(
				$author$project$Equation$intExpr(true)),
			A2($elm$core$Basics$composeR, $elm$parser$Parser$symbol, $author$project$Equation$lexeme)('='))),
	$author$project$Equation$lexeme(
		$author$project$Equation$intExpr(true)));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {az: col, aS: problem, aZ: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.aZ, p.az, p.aS);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{az: 1, j: _List_Nil, m: 1, f: 0, aZ: 1, e: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $author$project$Equation$parse = function (str) {
	return A2(
		$elm$parser$Parser$run,
		A2($elm$parser$Parser$ignorer, $author$project$Equation$equation, $elm$parser$Parser$end),
		str);
};
var $author$project$ShowProof$Done = {$: 0};
var $author$project$ShowProof$Next = function (a) {
	return {$: 2, a: a};
};
var $author$project$ShowProof$evalOneF = F3(
	function (n1, n2, fop) {
		if (!fop.$) {
			var r1 = fop.a;
			var r2 = fop.b;
			var r3 = fop.c;
			var r4 = fop.d;
			return $author$project$ShowProof$Next(
				_List_fromArray(
					[
						_Utils_Tuple2(
						$author$project$Generalise$ROp(
							A2($author$project$Generalise$Rect, n1 - n2, n2)),
						$author$project$Generalise$ROp(r1)),
						_Utils_Tuple2(
						$author$project$Generalise$ROp(
							A2($author$project$Generalise$Rect, n1 - n2, n2)),
						$author$project$Generalise$ROp(r2)),
						_Utils_Tuple2(
						$author$project$Generalise$ROp(
							A2($author$project$Generalise$Rect, n2, n1 - n2)),
						$author$project$Generalise$ROp(r3)),
						_Utils_Tuple2(
						$author$project$Generalise$ROp(
							A2($author$project$Generalise$Rect, n2, n1 - n2)),
						$author$project$Generalise$ROp(r4))
					]));
		} else {
			return $author$project$ShowProof$Done;
		}
	});
var $author$project$ShowProof$Fail = {$: 1};
var $author$project$ShowProof$evalOneL = F2(
	function (n, lop) {
		if (!lop.$) {
			var r = lop.a;
			var l = lop.b;
			return (n > 1) ? $author$project$ShowProof$Next(
				_List_fromArray(
					[
						_Utils_Tuple2(
						$author$project$Generalise$ROp(
							A2($author$project$Generalise$Rect, 1, 2)),
						$author$project$Generalise$ROp(r)),
						_Utils_Tuple2(
						$author$project$Generalise$LOp(
							$author$project$Generalise$L(n - 1)),
						$author$project$Generalise$LOp(l))
					])) : $author$project$ShowProof$Fail;
		} else {
			return $author$project$ShowProof$Done;
		}
	});
var $author$project$ShowProof$evalOneR = F3(
	function (n1, n2, rop) {
		switch (rop.$) {
			case 1:
				var t1 = rop.a;
				var t2 = rop.b;
				return ((n1 - n2) === 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n2)),
							$author$project$Generalise$TOp(t1)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n2)),
							$author$project$Generalise$TOp(t2))
						])) : (((n2 - n1) === 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n1)),
							$author$project$Generalise$TOp(t1)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n1)),
							$author$project$Generalise$TOp(t2))
						])) : $author$project$ShowProof$Fail);
			case 0:
				var s = rop.a;
				var r = rop.b;
				return (_Utils_cmp(n1, n2) > 0) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n2)),
							$author$project$Generalise$SOp(s)),
							_Utils_Tuple2(
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1 - n2, n2)),
							$author$project$Generalise$ROp(r))
						])) : ((_Utils_cmp(n2, n1) > 0) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n1)),
							$author$project$Generalise$SOp(s)),
							_Utils_Tuple2(
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n1, n2 - n1)),
							$author$project$Generalise$ROp(r))
						])) : $author$project$ShowProof$Fail);
			case 2:
				var s = rop.a;
				return _Utils_eq(n1, n2) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n1)),
							$author$project$Generalise$SOp(s))
						])) : $author$project$ShowProof$Fail;
			case 3:
				var r = rop.a;
				return $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, n2, n1)),
							$author$project$Generalise$ROp(r))
						]));
			default:
				return $author$project$ShowProof$Done;
		}
	});
var $author$project$ShowProof$evalOneS = F2(
	function (n, sop) {
		switch (sop.$) {
			case 0:
				var l = sop.a;
				var s = sop.b;
				return (n > 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$LOp(
								$author$project$Generalise$L(n)),
							$author$project$Generalise$LOp(l)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n - 1)),
							$author$project$Generalise$SOp(s))
						])) : $author$project$ShowProof$Fail;
			case 4:
				var t1 = sop.a;
				var t2 = sop.b;
				return (n > 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n)),
							$author$project$Generalise$TOp(t1)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n - 1)),
							$author$project$Generalise$TOp(t2))
						])) : $author$project$ShowProof$Fail;
			case 2:
				var f = sop.a;
				var s = sop.b;
				return (n >= 3) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$FOp(
								A2($author$project$Generalise$Frame, n, 1)),
							$author$project$Generalise$FOp(f)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n - 2)),
							$author$project$Generalise$SOp(s))
						])) : $author$project$ShowProof$Fail;
			case 1:
				var f = sop.a;
				var s = sop.b;
				return (n >= 3) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$FOp(
								A2($author$project$Generalise$Frame, n, ((n - 1) / 2) | 0)),
							$author$project$Generalise$FOp(f)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n - (2 * (((n - 1) / 2) | 0)))),
							$author$project$Generalise$SOp(s))
						])) : $author$project$ShowProof$Fail;
			case 3:
				var s1 = sop.a;
				var s2 = sop.b;
				var s3 = sop.c;
				var s4 = sop.d;
				return ((n >= 2) && (!A2($elm$core$Basics$modBy, 2, n))) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square((n / 2) | 0)),
							$author$project$Generalise$SOp(s1)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square((n / 2) | 0)),
							$author$project$Generalise$SOp(s2)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square((n / 2) | 0)),
							$author$project$Generalise$SOp(s3)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square((n / 2) | 0)),
							$author$project$Generalise$SOp(s4))
						])) : $author$project$ShowProof$Fail;
			default:
				return $author$project$ShowProof$Done;
		}
	});
var $author$project$ShowProof$evalOneT = F2(
	function (n, top) {
		switch (top.$) {
			case 0:
				var t1 = top.a;
				var s = top.b;
				var t2 = top.c;
				return (n > 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri((n / 2) | 0)),
							$author$project$Generalise$TOp(t1)),
							_Utils_Tuple2(
							$author$project$Generalise$SOp(
								$author$project$Generalise$Square(n - ((n / 2) | 0))),
							$author$project$Generalise$SOp(s)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri((n / 2) | 0)),
							$author$project$Generalise$TOp(t2))
						])) : $author$project$ShowProof$Fail;
			case 1:
				var l = top.a;
				var t = top.b;
				return (n > 2) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$LOp(
								$author$project$Generalise$L(n)),
							$author$project$Generalise$LOp(l)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n - 2)),
							$author$project$Generalise$TOp(t))
						])) : $author$project$ShowProof$Fail;
			case 2:
				var r = top.a;
				var t = top.b;
				return (n > 1) ? $author$project$ShowProof$Next(
					_List_fromArray(
						[
							_Utils_Tuple2(
							$author$project$Generalise$ROp(
								A2($author$project$Generalise$Rect, 1, n)),
							$author$project$Generalise$ROp(r)),
							_Utils_Tuple2(
							$author$project$Generalise$TOp(
								$author$project$Generalise$Tri(n - 1)),
							$author$project$Generalise$TOp(t))
						])) : $author$project$ShowProof$Fail;
			default:
				return $author$project$ShowProof$Done;
		}
	});
var $author$project$ShowProof$step = F2(
	function (count, current) {
		var _v0 = _Utils_Tuple2(count, current);
		_v0$0:
		while (true) {
			if (_v0.b.b) {
				if (!_v0.a) {
					break _v0$0;
				} else {
					var _v1 = _v0.b;
					var x = _v1.a;
					var xs = _v1.b;
					var next = function (st) {
						switch (st.$) {
							case 0:
								return A2(
									$elm$core$Maybe$map,
									$elm$core$List$cons(x),
									A2($author$project$ShowProof$step, count, xs));
							case 1:
								return $elm$core$Maybe$Nothing;
							default:
								var l = st.a;
								return A2(
									$author$project$ShowProof$step,
									count - 1,
									_Utils_ap(l, xs));
						}
					};
					_v2$5:
					while (true) {
						switch (x.a.$) {
							case 0:
								if ((x.a.a.$ === 5) && (!x.b.$)) {
									var n = x.a.a.a;
									var sop = x.b.a;
									return next(
										A2($author$project$ShowProof$evalOneS, n, sop));
								} else {
									break _v2$5;
								}
							case 1:
								if ((x.a.a.$ === 4) && (x.b.$ === 1)) {
									var _v3 = x.a.a;
									var n1 = _v3.a;
									var n2 = _v3.b;
									var rop = x.b.a;
									return next(
										A3($author$project$ShowProof$evalOneR, n1, n2, rop));
								} else {
									break _v2$5;
								}
							case 3:
								if ((x.a.a.$ === 3) && (x.b.$ === 3)) {
									var n = x.a.a.a;
									var top = x.b.a;
									return next(
										A2($author$project$ShowProof$evalOneT, n, top));
								} else {
									break _v2$5;
								}
							case 2:
								if ((x.a.a.$ === 1) && (x.b.$ === 2)) {
									var _v4 = x.a.a;
									var n1 = _v4.a;
									var n2 = _v4.b;
									var fop = x.b.a;
									return next(
										A3($author$project$ShowProof$evalOneF, n1, n2, fop));
								} else {
									break _v2$5;
								}
							default:
								if ((x.a.a.$ === 1) && (x.b.$ === 4)) {
									var n = x.a.a.a;
									var lop = x.b.a;
									return next(
										A2($author$project$ShowProof$evalOneL, n, lop));
								} else {
									break _v2$5;
								}
						}
					}
					return $elm$core$Maybe$Nothing;
				}
			} else {
				if (!_v0.a) {
					break _v0$0;
				} else {
					return $elm$core$Maybe$Just(_List_Nil);
				}
			}
		}
		return $elm$core$Maybe$Just(current);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							v: $author$project$Main$Formula(
								{E: '', Q: '', U: ''})
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{v: $author$project$Main$None}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var formula = msg.a;
				var _v1 = model.v;
				if (!_v1.$) {
					var modalForm = _v1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								v: $author$project$Main$Formula(
									_Utils_update(
										modalForm,
										{E: formula}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				var n1 = msg.a;
				var _v2 = model.v;
				if (!_v2.$) {
					var modalForm = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								v: $author$project$Main$Formula(
									_Utils_update(
										modalForm,
										{Q: n1}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var n2 = msg.a;
				var _v3 = model.v;
				if (!_v3.$) {
					var modalForm = _v3.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								v: $author$project$Main$Formula(
									_Utils_update(
										modalForm,
										{U: n2}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				var _v4 = model.v;
				if (!_v4.$) {
					var formula = _v4.a.E;
					var n1 = _v4.a.Q;
					var n2 = _v4.a.U;
					var _v5 = _Utils_Tuple3(
						$author$project$Equation$parse(formula),
						$elm$core$String$toInt(n1),
						$elm$core$String$toInt(n2));
					if (((!_v5.a.$) && (!_v5.b.$)) && (!_v5.c.$)) {
						var eq = _v5.a.a;
						var n1Parsed = _v5.b.a;
						var n2Parsed = _v5.c.a;
						var _v6 = A3($author$project$Discover$discover, eq, n1Parsed, n2Parsed);
						if (!_v6.$) {
							var sp = _v6.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										v: $author$project$Main$None,
										l: $author$project$Main$Proven(
											{E: formula, B: '', L: $elm$core$Maybe$Nothing, as: sp})
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 11:
				var _v7 = model.v;
				if (!_v7.$) {
					var formula = _v7.a.E;
					var n1 = _v7.a.Q;
					var n2 = _v7.a.U;
					var _v8 = _Utils_Tuple3(
						$author$project$Equation$parse(formula),
						$elm$core$String$toInt(n1),
						$elm$core$String$toInt(n2));
					if (((!_v8.a.$) && (!_v8.b.$)) && (!_v8.c.$)) {
						var _v9 = _v8.a.a;
						var e1 = _v9.a;
						var e2 = _v9.b;
						var n1Parsed = _v8.b.a;
						var n2Parsed = _v8.c.a;
						var shapes = A2(
							$elm$core$List$filterMap,
							$elm$core$List$head,
							A2(
								$elm$core$List$filter,
								$author$project$Discover$validStartRepr,
								_Utils_ap(
									$author$project$Netherite$representations(e1),
									$author$project$Netherite$representations(e2))));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									v: $author$project$Main$Shape(
										{E: formula, ak: '0', Q: n1Parsed, U: n2Parsed, y: shapes})
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 15:
				var index = msg.a;
				var _v10 = model.v;
				if (_v10.$ === 1) {
					var shape = _v10.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								v: $author$project$Main$Shape(
									_Utils_update(
										shape,
										{ak: index}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 12:
				var _v11 = model.v;
				if (_v11.$ === 1) {
					var shape = _v11.a;
					var _v12 = $elm$core$String$toInt(shape.ak);
					if (!_v12.$) {
						var index = _v12.a;
						var _v13 = A2($elm_community$list_extra$List$Extra$getAt, index, shape.y);
						if (!_v13.$) {
							var s = _v13.a;
							var _v14 = A2(
								$author$project$Generalise$repr2Goal,
								$elm$core$Dict$fromList(
									_List_fromArray(
										[
											_Utils_Tuple2('n', shape.Q)
										])),
								_List_fromArray(
									[s]));
							if (((!_v14.$) && _v14.a.b) && (!_v14.a.b.b)) {
								var _v15 = _v14.a;
								var start = _v15.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											v: $author$project$Main$None,
											l: $author$project$Main$Proving(
												{
													E: shape.E,
													an: $elm$core$Maybe$Just(shape.U),
													ap: 'none',
													o: _List_fromArray(
														[
															_Utils_Tuple2(shape.Q, start)
														]),
													y: s
												})
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 14:
				var _v16 = model.l;
				if (_v16.$ === 2) {
					var p = _v16.a;
					var _v17 = p.an;
					if (!_v17.$) {
						var n2 = _v17.a;
						var _v18 = A2(
							$author$project$Generalise$repr2Goal,
							$elm$core$Dict$fromList(
								_List_fromArray(
									[
										_Utils_Tuple2('n', n2)
									])),
							_List_fromArray(
								[p.y]));
						if (((!_v18.$) && _v18.a.b) && (!_v18.a.b.b)) {
							var _v19 = _v18.a;
							var start = _v19.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										l: $author$project$Main$Proving(
											_Utils_update(
												p,
												{
													an: $elm$core$Maybe$Nothing,
													o: A2(
														$elm$core$List$cons,
														_Utils_Tuple2(n2, start),
														p.o)
												}))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						var _v20 = p.o;
						if (_v20.b && _v20.b.b) {
							var p1 = _v20.a;
							var _v21 = _v20.b;
							var p2 = _v21.a;
							var xs = _v21.b;
							var _v22 = A2($author$project$Generalise$infer, p1, p2);
							if (!_v22.$) {
								var sp = _v22.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											v: $author$project$Main$None,
											l: $author$project$Main$Proven(
												{
													E: p.E,
													B: '',
													L: $elm$core$Maybe$Nothing,
													as: _Utils_Tuple2(p.y, sp)
												})
										}),
									$elm$core$Platform$Cmd$none);
							} else {
								return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
							}
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 13:
				var op = msg.a;
				var _v23 = model.l;
				if (_v23.$ === 2) {
					var p = _v23.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: $author$project$Main$Proving(
									_Utils_update(
										p,
										{ap: op}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 6:
				var n = msg.a;
				var _v24 = model.l;
				if (_v24.$ === 1) {
					var p = _v24.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: $author$project$Main$Proven(
									_Utils_update(
										p,
										{B: n}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var _v25 = model.l;
				if (_v25.$ === 1) {
					var p = _v25.a;
					var n = p.B;
					var schematic = p.as;
					var _v26 = $elm$core$String$toInt(n);
					if (!_v26.$) {
						var nParsed = _v26.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									l: $author$project$Main$Proven(
										_Utils_update(
											p,
											{
												L: A2(
													$elm$core$Maybe$map,
													function (_v27) {
														var start = _v27.a;
														var proof = _v27.b;
														return {
															ai: _List_fromArray(
																[
																	_Utils_Tuple2(start, proof)
																]),
															ab: false,
															al: $author$project$ShowProof$countSteps(proof),
															B: 0,
															ar: proof,
															au: start
														};
													},
													A2($author$project$Discover$eval, schematic, nParsed))
											}))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				var step = msg.a;
				var _v28 = model.l;
				if (_v28.$ === 1) {
					var p = _v28.a;
					var pt = p.L;
					if (!pt.$) {
						var jp = pt.a;
						var _v30 = A2(
							$author$project$ShowProof$step,
							step,
							_List_fromArray(
								[
									_Utils_Tuple2(jp.au, jp.ar)
								]));
						if (!_v30.$) {
							var current = _v30.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										l: $author$project$Main$Proven(
											_Utils_update(
												p,
												{
													L: $elm$core$Maybe$Just(
														_Utils_update(
															jp,
															{ai: current, B: step}))
												}))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var _v31 = model.l;
				if (_v31.$ === 1) {
					var p = _v31.a;
					var pt = p.L;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: $author$project$Main$Proven(
									_Utils_update(
										p,
										{
											L: A2(
												$elm$core$Maybe$map,
												function (jp) {
													return _Utils_update(
														jp,
														{ab: true});
												},
												pt)
										}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				var _v32 = model.l;
				if (_v32.$ === 1) {
					var p = _v32.a;
					var pt = p.L;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: $author$project$Main$Proven(
									_Utils_update(
										p,
										{
											L: A2(
												$elm$core$Maybe$map,
												function (jp) {
													return _Utils_update(
														jp,
														{ab: false});
												},
												pt)
										}))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				if (msg.a.$ === 6) {
					var proof = msg.a.a;
					var _v33 = model.l;
					if (_v33.$ === 2) {
						var p = _v33.a;
						var _v34 = p.o;
						if (_v34.b) {
							var _v35 = _v34.a;
							var n = _v35.a;
							var x = _v35.b;
							var xs = _v34.b;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										l: $author$project$Main$Proving(
											_Utils_update(
												p,
												{
													o: A2(
														$elm$core$List$cons,
														_Utils_Tuple2(n, proof),
														xs)
												}))
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						}
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Main$Done = {$: 14};
var $author$project$Main$GenM = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$NewProof = {$: 0};
var $author$project$Main$SetN = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$SetOp = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$ShowProof = {$: 7};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Main$Hovering = {$: 9};
var $author$project$Main$NotHovering = {$: 10};
var $author$project$Main$SetStep = function (a) {
	return {$: 8, a: a};
};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Generalise$UpdateProof = function (a) {
	return {$: 6, a: a};
};
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $author$project$Generalise$distance = 20;
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$Generalise$radius = 5;
var $author$project$Generalise$draw = F2(
	function (x, y) {
		return A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx(
					$elm$core$String$fromInt($author$project$Generalise$radius + ($author$project$Generalise$distance * x))),
					$elm$svg$Svg$Attributes$cy(
					$elm$core$String$fromInt($author$project$Generalise$radius + ($author$project$Generalise$distance * y))),
					$elm$svg$Svg$Attributes$r(
					$elm$core$String$fromInt($author$project$Generalise$radius))
				]),
			_List_Nil);
	});
var $author$project$Generalise$column = F3(
	function (start, end, x) {
		return A2(
			$elm$core$List$map,
			$author$project$Generalise$draw(x),
			A2($elm$core$List$range, start, end - 1));
	});
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Generalise$row = F3(
	function (start, end, y) {
		return A2(
			$elm$core$List$map,
			function (x) {
				return A2($author$project$Generalise$draw, x, y);
			},
			A2($elm$core$List$range, start, end - 1));
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Generalise$drawFOp = F3(
	function (op, rest, tree) {
		switch (tree.$) {
			case 2:
				return _List_Nil;
			case 3:
				return _List_Nil;
			case 4:
				return _List_Nil;
			case 0:
				var r1 = tree.a;
				var r2 = tree.b;
				var r3 = tree.c;
				var r4 = tree.d;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawROp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A4($author$project$Generalise$SplitFrame, x, r2, r3, r4);
							}),
						r1),
					_Utils_ap(
						A3(
							$author$project$Generalise$drawROp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A4($author$project$Generalise$SplitFrame, r1, x, r3, r4);
								}),
							r2),
						_Utils_ap(
							A3(
								$author$project$Generalise$drawROp,
								op,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$SplitFrame, r1, r2, x, r4);
									}),
								r3),
							A3(
								$author$project$Generalise$drawROp,
								op,
								A2(
									$elm$core$Basics$composeL,
									rest,
									A3($author$project$Generalise$SplitFrame, r1, r2, r3)),
								r4))));
			default:
				var n = tree.a;
				var m = tree.b;
				var picture = function (event) {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'padding', '30px'),
										$elm$html$Html$Attributes$width((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius)),
										$elm$html$Html$Attributes$height((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius))
									]),
								event),
							_Utils_ap(
								A2(
									$elm$core$List$concatMap,
									A2($author$project$Generalise$column, 0, n),
									A2($elm$core$List$range, 0, m - 1)),
								_Utils_ap(
									A2(
										$elm$core$List$concatMap,
										A2($author$project$Generalise$row, m, n - m),
										A2($elm$core$List$range, 0, m - 1)),
									_Utils_ap(
										A2(
											$elm$core$List$concatMap,
											A2($author$project$Generalise$row, m, n - m),
											A2($elm$core$List$range, n - m, n - 1)),
										A2(
											$elm$core$List$concatMap,
											A2($author$project$Generalise$column, 0, n),
											A2($elm$core$List$range, n - m, n - 1))))))
						]);
				};
				if (op === 'splitFrame') {
					return picture(
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Generalise$UpdateProof(
									rest(
										A4(
											$author$project$Generalise$SplitFrame,
											A2($author$project$Generalise$Rect, n - m, m),
											A2($author$project$Generalise$Rect, n - m, m),
											A2($author$project$Generalise$Rect, m, n - m),
											A2($author$project$Generalise$Rect, m, n - m)))))
							]));
				} else {
					return picture(_List_Nil);
				}
		}
	});
var $author$project$Generalise$drawLOp = F3(
	function (op, rest, tree) {
		switch (tree.$) {
			case 2:
				return _List_Nil;
			case 3:
				return _List_Nil;
			case 4:
				return _List_Nil;
			case 0:
				var r = tree.a;
				var l = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawROp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitEnds, x, l);
							}),
						r),
					A3(
						$author$project$Generalise$drawLOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitEnds(r)),
						l));
			default:
				var n = tree.a;
				var picture = function (event) {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'padding', '30px'),
										$elm$html$Html$Attributes$width((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius)),
										$elm$html$Html$Attributes$height((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius))
									]),
								event),
							_Utils_ap(
								A3($author$project$Generalise$row, 1, n, n - 1),
								A3($author$project$Generalise$column, 0, n, 0)))
						]);
				};
				if (op === 'splitEnds') {
					return (n > 1) ? picture(
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$author$project$Generalise$UpdateProof(
									rest(
										A2(
											$author$project$Generalise$SplitEnds,
											A2($author$project$Generalise$Rect, 1, 2),
											$author$project$Generalise$L(n - 1)))))
							])) : picture(_List_Nil);
				} else {
					return picture(_List_Nil);
				}
		}
	});
var $author$project$Generalise$drawROp = F3(
	function (op, rest, tree) {
		drawROp:
		while (true) {
			switch (tree.$) {
				case 5:
					return _List_Nil;
				case 6:
					return _List_Nil;
				case 7:
					return _List_Nil;
				case 0:
					var s = tree.a;
					var r = tree.b;
					return _Utils_ap(
						A3(
							$author$project$Generalise$drawSOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A2($author$project$Generalise$SplitSquare, x, r);
								}),
							s),
						A3(
							$author$project$Generalise$drawROp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								$author$project$Generalise$SplitSquare(s)),
							r));
				case 3:
					var r = tree.a;
					var $temp$op = op,
						$temp$rest = A2($elm$core$Basics$composeL, rest, $author$project$Generalise$Rotate),
						$temp$tree = r;
					op = $temp$op;
					rest = $temp$rest;
					tree = $temp$tree;
					continue drawROp;
				case 2:
					var s = tree.a;
					return A3(
						$author$project$Generalise$drawSOp,
						op,
						A2($elm$core$Basics$composeL, rest, $author$project$Generalise$ToSquare),
						s);
				case 1:
					var t1 = tree.a;
					var t2 = tree.b;
					return _Utils_ap(
						A3(
							$author$project$Generalise$drawTOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A2($author$project$Generalise$SplitDiaR, x, t2);
								}),
							t1),
						A3(
							$author$project$Generalise$drawTOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								$author$project$Generalise$SplitDiaR(t1)),
							t2));
				default:
					var n = tree.a;
					var m = tree.b;
					var picture = function (event) {
						return _List_fromArray(
							[
								A2(
								$elm$svg$Svg$svg,
								_Utils_ap(
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'padding', '30px'),
											$elm$html$Html$Attributes$width((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius)),
											$elm$html$Html$Attributes$height((m * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius))
										]),
									event),
								A2(
									$elm$core$List$concatMap,
									A2($author$project$Generalise$column, 0, m),
									A2($elm$core$List$range, 0, n - 1)))
							]);
					};
					switch (op) {
						case 'rotate':
							return picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												$author$project$Generalise$Rotate(
													A2($author$project$Generalise$Rect, m, n)))))
									]));
						case 'splitDia':
							return ((n - m) === 1) ? picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												A2(
													$author$project$Generalise$SplitDiaR,
													$author$project$Generalise$Tri(m),
													$author$project$Generalise$Tri(m)))))
									])) : (((m - n) === 1) ? picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												A2(
													$author$project$Generalise$SplitDiaR,
													$author$project$Generalise$Tri(n),
													$author$project$Generalise$Tri(n)))))
									])) : picture(_List_Nil));
						case 'splitSquare':
							return (_Utils_cmp(n, m) > 0) ? picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												A2(
													$author$project$Generalise$SplitSquare,
													$author$project$Generalise$Square(m),
													A2($author$project$Generalise$Rect, n - m, m)))))
									])) : ((_Utils_cmp(m, n) > 0) ? picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												A2(
													$author$project$Generalise$SplitSquare,
													$author$project$Generalise$Square(n),
													A2($author$project$Generalise$Rect, n, m - n)))))
									])) : picture(_List_Nil));
						case 'toSquare':
							return _Utils_eq(n, m) ? picture(
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										$author$project$Generalise$UpdateProof(
											rest(
												$author$project$Generalise$ToSquare(
													$author$project$Generalise$Square(n)))))
									])) : picture(_List_Nil);
						default:
							return picture(_List_Nil);
					}
			}
		}
	});
var $author$project$Generalise$drawSOp = F3(
	function (op, rest, tree) {
		switch (tree.$) {
			case 6:
				return _List_Nil;
			case 7:
				return _List_Nil;
			case 8:
				return _List_Nil;
			case 0:
				var l = tree.a;
				var s = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawLOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutS, x, s);
							}),
						l),
					A3(
						$author$project$Generalise$drawSOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutS(l)),
						s));
			case 1:
				var f = tree.a;
				var s = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawFOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitInnerSquare, x, s);
							}),
						f),
					A3(
						$author$project$Generalise$drawSOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitInnerSquare(f)),
						s));
			case 2:
				var f = tree.a;
				var s = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawFOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitOuterFrame, x, s);
							}),
						f),
					A3(
						$author$project$Generalise$drawSOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitOuterFrame(f)),
						s));
			case 3:
				var s1 = tree.a;
				var s2 = tree.b;
				var s3 = tree.c;
				var s4 = tree.d;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawSOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A4($author$project$Generalise$Split4, x, s2, s3, s4);
							}),
						s1),
					_Utils_ap(
						A3(
							$author$project$Generalise$drawSOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A4($author$project$Generalise$Split4, s1, x, s3, s4);
								}),
							s2),
						_Utils_ap(
							A3(
								$author$project$Generalise$drawSOp,
								op,
								A2(
									$elm$core$Basics$composeL,
									rest,
									function (x) {
										return A4($author$project$Generalise$Split4, s1, s2, x, s4);
									}),
								s3),
							A3(
								$author$project$Generalise$drawSOp,
								op,
								A2(
									$elm$core$Basics$composeL,
									rest,
									A3($author$project$Generalise$Split4, s1, s2, s3)),
								s4))));
			case 4:
				var t1 = tree.a;
				var t2 = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawTOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitDiaS, x, t2);
							}),
						t1),
					A3(
						$author$project$Generalise$drawTOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitDiaS(t1)),
						t2));
			default:
				var n = tree.a;
				var picture = function (event) {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'padding', '30px'),
										$elm$html$Html$Attributes$width((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius)),
										$elm$html$Html$Attributes$height((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius))
									]),
								event),
							A2(
								$elm$core$List$concatMap,
								A2($author$project$Generalise$column, 0, n),
								A2($elm$core$List$range, 0, n - 1)))
						]);
				};
				switch (op) {
					case 'lcut':
						return (n > 1) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$LCutS,
												$author$project$Generalise$L(n),
												$author$project$Generalise$Square(n - 1)))))
								])) : picture(_List_Nil);
					case 'splitDia':
						return (n > 1) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$SplitDiaS,
												$author$project$Generalise$Tri(n),
												$author$project$Generalise$Tri(n - 1)))))
								])) : picture(_List_Nil);
					case 'splitOuterFrame':
						return (n >= 3) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$SplitOuterFrame,
												A2($author$project$Generalise$Frame, n, 1),
												$author$project$Generalise$Square(n - 2)))))
								])) : picture(_List_Nil);
					case 'splitInnerSquare':
						return (n >= 3) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$SplitInnerSquare,
												A2($author$project$Generalise$Frame, n, ((n - 1) / 2) | 0),
												$author$project$Generalise$Square(n - (2 * (((n - 1) / 2) | 0)))))))
								])) : picture(_List_Nil);
					case 'split4':
						return ((n >= 2) && (!A2($elm$core$Basics$modBy, 2, n))) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A4(
												$author$project$Generalise$Split4,
												$author$project$Generalise$Square((n / 2) | 0),
												$author$project$Generalise$Square((n / 2) | 0),
												$author$project$Generalise$Square((n / 2) | 0),
												$author$project$Generalise$Square((n / 2) | 0)))))
								])) : picture(_List_Nil);
					default:
						return picture(_List_Nil);
				}
		}
	});
var $author$project$Generalise$drawTOp = F3(
	function (op, rest, tree) {
		switch (tree.$) {
			case 4:
				return _List_Nil;
			case 5:
				return _List_Nil;
			case 6:
				return _List_Nil;
			case 0:
				var t1 = tree.a;
				var s = tree.b;
				var t2 = tree.c;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawTOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A3($author$project$Generalise$SplitTST, x, s, t2);
							}),
						t1),
					_Utils_ap(
						A3(
							$author$project$Generalise$drawSOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								function (x) {
									return A3($author$project$Generalise$SplitTST, t1, x, t2);
								}),
							s),
						A3(
							$author$project$Generalise$drawTOp,
							op,
							A2(
								$elm$core$Basics$composeL,
								rest,
								A2($author$project$Generalise$SplitTST, t1, s)),
							t2)));
			case 1:
				var l = tree.a;
				var t = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawLOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$LCutT, x, t);
							}),
						l),
					A3(
						$author$project$Generalise$drawTOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$LCutT(l)),
						t));
			case 2:
				var r = tree.a;
				var t = tree.b;
				return _Utils_ap(
					A3(
						$author$project$Generalise$drawROp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							function (x) {
								return A2($author$project$Generalise$SplitSide, x, t);
							}),
						r),
					A3(
						$author$project$Generalise$drawTOp,
						op,
						A2(
							$elm$core$Basics$composeL,
							rest,
							$author$project$Generalise$SplitSide(r)),
						t));
			default:
				var n = tree.a;
				var picture = function (event) {
					return _List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_Utils_ap(
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'padding', '30px'),
										$elm$html$Html$Attributes$width((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius)),
										$elm$html$Html$Attributes$height((n * $author$project$Generalise$distance) - (2 * $author$project$Generalise$radius))
									]),
								event),
							A2(
								$elm$core$List$concatMap,
								function (x) {
									return A3($author$project$Generalise$row, 0, x + 1, x);
								},
								A2($elm$core$List$range, 0, n - 1)))
						]);
				};
				switch (op) {
					case 'splitTST':
						return (n > 1) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A3(
												$author$project$Generalise$SplitTST,
												$author$project$Generalise$Tri((n / 2) | 0),
												$author$project$Generalise$Square(n - ((n / 2) | 0)),
												$author$project$Generalise$Tri((n / 2) | 0)))))
								])) : picture(_List_Nil);
					case 'lcut':
						return (n > 2) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$LCutT,
												$author$project$Generalise$L(n),
												$author$project$Generalise$Tri(n - 2)))))
								])) : picture(_List_Nil);
					case 'splitSide':
						return (n > 1) ? picture(
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Generalise$UpdateProof(
										rest(
											A2(
												$author$project$Generalise$SplitSide,
												A2($author$project$Generalise$Rect, 1, n),
												$author$project$Generalise$Tri(n - 1)))))
								])) : picture(_List_Nil);
					default:
						return picture(_List_Nil);
				}
		}
	});
var $author$project$Generalise$drawShapes = F2(
	function (op, tree) {
		switch (tree.$) {
			case 0:
				var s = tree.a;
				return A3($author$project$Generalise$drawSOp, op, $author$project$Generalise$SOp, s);
			case 1:
				var r = tree.a;
				return A3($author$project$Generalise$drawROp, op, $author$project$Generalise$ROp, r);
			case 3:
				var t = tree.a;
				return A3($author$project$Generalise$drawTOp, op, $author$project$Generalise$TOp, t);
			case 2:
				var f = tree.a;
				return A3($author$project$Generalise$drawFOp, op, $author$project$Generalise$FOp, f);
			default:
				var l = tree.a;
				return A3($author$project$Generalise$drawLOp, op, $author$project$Generalise$LOp, l);
		}
	});
var $author$project$Main$draw = F2(
	function (drawBorder, pt) {
		return A2(
			$elm$html$Html$div,
			drawBorder ? _List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'border', '2px solid blue'),
					$elm$html$Html$Attributes$class('d-inline-block shape-container')
				]) : _List_fromArray(
				[
					$elm$html$Html$Attributes$class('d-inline-block shape-container')
				]),
			A2($author$project$Generalise$drawShapes, '', pt));
	});
var $author$project$ShowProof$findNextStep = function (pts) {
	var helper = F2(
		function (n, pts_) {
			helper:
			while (true) {
				if (pts_.b) {
					var x = pts_.a;
					var xs = pts_.b;
					_v1$14:
					while (true) {
						switch (x.$) {
							case 0:
								switch (x.a.$) {
									case 0:
										var _v2 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('L-Cut', n));
									case 4:
										var _v3 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Diagonal', n));
									case 2:
										var _v4 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Outer Frame', n));
									case 1:
										var _v5 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Inner Square', n));
									case 3:
										var _v6 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Four', n));
									default:
										break _v1$14;
								}
							case 1:
								switch (x.a.$) {
									case 1:
										var _v7 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Diagonal', n));
									case 0:
										var _v8 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Square', n));
									case 2:
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('To Square', n));
									case 3:
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Rotate', n));
									default:
										break _v1$14;
								}
							case 3:
								switch (x.a.$) {
									case 0:
										var _v9 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('SplitTST', n));
									case 1:
										var _v10 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('L-Cut', n));
									case 2:
										var _v11 = x.a;
										return $elm$core$Maybe$Just(
											_Utils_Tuple2('Split Side', n));
									default:
										break _v1$14;
								}
							case 2:
								if (!x.a.$) {
									var _v12 = x.a;
									return $elm$core$Maybe$Just(
										_Utils_Tuple2('Split Frame', n));
								} else {
									break _v1$14;
								}
							default:
								if (!x.a.$) {
									var _v13 = x.a;
									return $elm$core$Maybe$Just(
										_Utils_Tuple2('Split Ends', n));
								} else {
									break _v1$14;
								}
						}
					}
					var $temp$n = n + 1,
						$temp$pts_ = xs;
					n = $temp$n;
					pts_ = $temp$pts_;
					continue helper;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		});
	return A2(helper, 0, pts);
};
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseleave',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$drawProofStepState = function (_v0) {
	var n = _v0.B;
	var current = _v0.ai;
	var hovering = _v0.ab;
	var max = _v0.al;
	var nextStep = $author$project$ShowProof$findNextStep(
		A2($elm$core$List$map, $elm$core$Tuple$second, current));
	var nextStepN = A2(
		$elm$core$Maybe$withDefault,
		-1,
		A2($elm$core$Maybe$map, $elm$core$Tuple$second, nextStep));
	var nextStepName = function () {
		if (!nextStep.$) {
			var _v2 = nextStep.a;
			var name = _v2.a;
			return name + ' ';
		} else {
			return '';
		}
	}();
	return _Utils_ap(
		_List_fromArray(
			[
				A2(
				$elm$html$Html$form,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-inline mt-1')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(n <= 0),
								A2(
								$elm$html$Html$Events$preventDefaultOn,
								'click',
								$elm$json$Json$Decode$succeed(
									_Utils_Tuple2(
										$author$project$Main$SetStep(
											A2($elm$core$Basics$max, n - 1, 0)),
										true))),
								$elm$html$Html$Attributes$class('btn btn-outline-secondary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('<')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('range'),
								$elm$html$Html$Attributes$min('0'),
								$elm$html$Html$Attributes$max(
								$elm$core$String$fromInt(max)),
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(n)),
								$elm$html$Html$Events$onInput(
								A2(
									$elm$core$Basics$composeR,
									$elm$core$String$toInt,
									A2(
										$elm$core$Basics$composeR,
										$elm$core$Maybe$withDefault(n),
										$author$project$Main$SetStep)))
							]),
						_List_Nil),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(
								_Utils_cmp(n, max) > -1),
								A2(
								$elm$html$Html$Events$preventDefaultOn,
								'click',
								$elm$json$Json$Decode$succeed(
									_Utils_Tuple2(
										$author$project$Main$SetStep(
											A2($elm$core$Basics$min, n + 1, max)),
										true))),
								$elm$html$Html$Events$onMouseEnter($author$project$Main$Hovering),
								$elm$html$Html$Events$onMouseLeave($author$project$Main$NotHovering),
								$elm$html$Html$Attributes$class('btn btn-outline-secondary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(nextStepName + '>')
							])),
						A2($elm$html$Html$br, _List_Nil, _List_Nil)
					]))
			]),
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (stepN, shape) {
					return A2(
						$elm$html$Html$map,
						$author$project$Main$GenM,
						A2(
							$author$project$Main$draw,
							_Utils_eq(stepN, nextStepN) && hovering,
							shape.a));
				}),
			current));
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Main$enterDecoder = function (msg) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (key) {
			return (key === 'Enter') ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('Non-enter key pressed');
		},
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Main$CancelModal = {$: 1};
var $author$project$Main$Discover = {$: 5};
var $author$project$Main$Manual = {$: 11};
var $author$project$Main$Prove = {$: 12};
var $author$project$Main$SetFormula = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$SetN1 = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$SetN2 = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$SetShape = function (a) {
	return {$: 15, a: a};
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Main$equations = _List_fromArray(
	[
		_Utils_Tuple2('n^2=Sum(i,1,n,2*i-1)', true),
		_Utils_Tuple2('(n*(n+1))/2=Sum(i,1,n,i)', true),
		_Utils_Tuple2('Tri(2*n+1)=Tri(n+1)+3*Tri(n)', true),
		_Utils_Tuple2('Tri(2*n)=Sum(i,1,n,2*(2*i)-1)', true),
		_Utils_Tuple2('(2*n+1)^2=1+4*Sum(i,1,n,2*i)', true),
		_Utils_Tuple2('Fib(n)*Fib(n+1)=Sum(i,1,n,Fib(i)^2)', true),
		_Utils_Tuple2('Tri(2*n-1)=Sum(i,1,n,2*(2*i-1)-1)', true),
		_Utils_Tuple2('n*(n+1)=(n*(n+1))/2+(n*(n+1))/2', true),
		_Utils_Tuple2('Tri(2*n)=Tri(n-1)+3*Tri(n)', true),
		_Utils_Tuple2('(2*n+1)^2=8*Tri(n)+1', true),
		_Utils_Tuple2('(2*n)^2=8*Tri(n-1)+4*n', true),
		_Utils_Tuple2('n*(n+3)=(n+3)*n', true)
	]);
var $elm$html$Html$h5 = _VirtualDom_node('h5');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$Netherite$isUnit = function (expr) {
	switch (expr.$) {
		case 5:
			return true;
		case 6:
			return true;
		case 4:
			return true;
		case 7:
			return true;
		case 8:
			return true;
		case 9:
			return true;
		default:
			return false;
	}
};
var $author$project$Netherite$exprToString = function (expr) {
	switch (expr.$) {
		case 6:
			var i = expr.a;
			return $elm$core$String$fromInt(i);
		case 5:
			var name = expr.a;
			return $elm$core$String$fromChar(name);
		case 0:
			var e1 = expr.a;
			var e2 = expr.b;
			return $author$project$Netherite$exprToString(e1) + ('+' + $author$project$Netherite$exprToString(e2));
		case 2:
			var e1 = expr.a;
			var e2 = expr.b;
			return ($author$project$Netherite$isUnit(e1) && $author$project$Netherite$isUnit(e2)) ? ($author$project$Netherite$exprToString(e1) + ('-' + $author$project$Netherite$exprToString(e2))) : ('(' + ($author$project$Netherite$exprToString(e1) + (')-(' + ($author$project$Netherite$exprToString(e2) + ')'))));
		case 1:
			var e1 = expr.a;
			var e2 = expr.b;
			return ($author$project$Netherite$isUnit(e1) && $author$project$Netherite$isUnit(e2)) ? ($author$project$Netherite$exprToString(e1) + ('*' + $author$project$Netherite$exprToString(e2))) : ('(' + ($author$project$Netherite$exprToString(e1) + (')*(' + ($author$project$Netherite$exprToString(e2) + ')'))));
		case 3:
			var e1 = expr.a;
			var e2 = expr.b;
			return ($author$project$Netherite$isUnit(e1) && $author$project$Netherite$isUnit(e2)) ? ($author$project$Netherite$exprToString(e1) + ('/' + $author$project$Netherite$exprToString(e2))) : ('(' + ($author$project$Netherite$exprToString(e1) + (')/(' + ($author$project$Netherite$exprToString(e2) + ')'))));
		case 4:
			var e1 = expr.a;
			var e2 = expr.b;
			return ($author$project$Netherite$isUnit(e1) && $author$project$Netherite$isUnit(e2)) ? ($author$project$Netherite$exprToString(e1) + ('^' + $author$project$Netherite$exprToString(e2))) : ('(' + ($author$project$Netherite$exprToString(e1) + (')^(' + ($author$project$Netherite$exprToString(e2) + ')'))));
		case 7:
			var sum = expr.a;
			var _v1 = sum.a4;
			var name = _v1;
			return 'Sum(' + ($elm$core$String$fromChar(name) + (',' + ($author$project$Netherite$exprToString(sum.au) + (',' + ($author$project$Netherite$exprToString(sum.aB) + (',' + ($author$project$Netherite$exprToString(sum.aE) + ')')))))));
		case 8:
			var e = expr.a;
			return 'Fib(' + ($author$project$Netherite$exprToString(e) + ')');
		default:
			var e = expr.a;
			return 'Tri(' + ($author$project$Netherite$exprToString(e) + ')');
	}
};
var $author$project$Netherite$shapeToString = function (shape) {
	switch (shape.$) {
		case 0:
			return 'Square(1)';
		case 1:
			var e = shape.a;
			return 'Rect(1 x ' + ($author$project$Netherite$exprToString(e) + ')');
		case 2:
			var e = shape.a;
			return 'L(' + ($author$project$Netherite$exprToString(e) + ')');
		case 3:
			var e = shape.a;
			return 'Square(' + ($author$project$Netherite$exprToString(e) + ')');
		case 4:
			var e = shape.a;
			return 'Tri(' + ($author$project$Netherite$exprToString(e) + ')');
		case 5:
			var e1 = shape.a;
			var e2 = shape.b;
			return 'Rect(' + ($author$project$Netherite$exprToString(e1) + (' x ' + ($author$project$Netherite$exprToString(e2) + ')')));
		default:
			return '';
	}
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$sub = _VirtualDom_node('sub');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$showModal = function (modal) {
	switch (modal.$) {
		case 0:
			var formula = modal.a.E;
			var n1 = modal.a.Q;
			var n2 = modal.a.U;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal'),
							$elm$html$Html$Attributes$tabindex(-1),
							A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
							A2($elm$html$Html$Attributes$style, 'display', 'block')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('modal-dialog'),
									A2($elm$html$Html$Attributes$attribute, 'role', 'document')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('modal-content')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-header')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h5,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('modal-title')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('New Proof')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('close'),
															$elm$html$Html$Events$onClick($author$project$Main$CancelModal)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('×')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-body')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$form,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('m-0')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('form-group')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('input-group')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('input-group-prepend')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('input-group-text')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text('Equation')
																						]))
																				])),
																			A2(
																			$elm$html$Html$input,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$type_('text'),
																					$elm$html$Html$Attributes$class('form-control'),
																					$elm$html$Html$Attributes$value(formula),
																					$elm$html$Html$Events$onInput($author$project$Main$SetFormula)
																				]),
																			_List_Nil),
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('input-group-append')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$button,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('btn btn-outline-secondary dropdown-toggle'),
																							A2($elm$html$Html$Attributes$attribute, 'data-toggle', 'dropdown')
																						]),
																					_List_Nil),
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('dropdown-menu dropdown-menu-right')
																						]),
																					A2(
																						$elm$core$List$map,
																						function (_v1) {
																							var eq = _v1.a;
																							var dev = _v1.b;
																							return A2(
																								$elm$html$Html$a,
																								_List_fromArray(
																									[
																										$elm$html$Html$Attributes$class('dropdown-item'),
																										$elm$html$Html$Attributes$href('#'),
																										$elm$html$Html$Events$onClick(
																										$author$project$Main$SetFormula(eq))
																									]),
																								_List_fromArray(
																									[
																										$elm$html$Html$text(eq),
																										A2(
																										$elm$html$Html$span,
																										_List_fromArray(
																											[
																												$elm$html$Html$Attributes$class('float-right ml-2')
																											]),
																										_List_fromArray(
																											[
																												$elm$html$Html$text(
																												dev ? '✓' : '✕')
																											]))
																									]));
																						},
																						$author$project$Main$equations))
																				]))
																		]))
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('form-row')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col-md-6')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('input-group')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('input-group-prepend')
																						]),
																					_List_fromArray(
																						[
																							A2(
																							$elm$html$Html$div,
																							_List_fromArray(
																								[
																									$elm$html$Html$Attributes$class('input-group-text')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text('n'),
																									A2(
																									$elm$html$Html$sub,
																									_List_Nil,
																									_List_fromArray(
																										[
																											$elm$html$Html$text('1')
																										]))
																								]))
																						])),
																					A2(
																					$elm$html$Html$input,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$type_('text'),
																							$elm$html$Html$Attributes$class('form-control'),
																							$elm$html$Html$Attributes$value(n1),
																							$elm$html$Html$Events$onInput($author$project$Main$SetN1)
																						]),
																					_List_Nil)
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col-md-6')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('input-group')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('input-group-prepend')
																						]),
																					_List_fromArray(
																						[
																							A2(
																							$elm$html$Html$div,
																							_List_fromArray(
																								[
																									$elm$html$Html$Attributes$class('input-group-text')
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text('n'),
																									A2(
																									$elm$html$Html$sub,
																									_List_Nil,
																									_List_fromArray(
																										[
																											$elm$html$Html$text('2')
																										]))
																								]))
																						])),
																					A2(
																					$elm$html$Html$input,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$type_('text'),
																							$elm$html$Html$Attributes$class('form-control'),
																							$elm$html$Html$Attributes$value(n2),
																							$elm$html$Html$Events$onInput($author$project$Main$SetN2)
																						]),
																					_List_Nil)
																				]))
																		]))
																]))
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-footer')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('mr-auto btn btn-outline-danger'),
															$elm$html$Html$Events$onClick($author$project$Main$CancelModal)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Cancel')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('btn btn-outline-primary'),
															$elm$html$Html$Events$onClick($author$project$Main$Discover)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Discover Proof')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('btn btn-primary'),
															$elm$html$Html$Events$onClick($author$project$Main$Manual)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Manually Prove')
														]))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-backdrop show'),
							$elm$html$Html$Attributes$id('error-modal-back')
						]),
					_List_Nil)
				]);
		case 1:
			var shape = modal.a.y;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal'),
							$elm$html$Html$Attributes$tabindex(-1),
							A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
							A2($elm$html$Html$Attributes$style, 'display', 'block')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('modal-dialog'),
									A2($elm$html$Html$Attributes$attribute, 'role', 'document')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('modal-content')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-header')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h5,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('modal-title')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Start Shape')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('close'),
															$elm$html$Html$Events$onClick($author$project$Main$CancelModal)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('×')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-body')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$form,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('m-0')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('form-group')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('input-group')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$div,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('input-group-prepend')
																				]),
																			_List_fromArray(
																				[
																					A2(
																					$elm$html$Html$div,
																					_List_fromArray(
																						[
																							$elm$html$Html$Attributes$class('input-group-text')
																						]),
																					_List_fromArray(
																						[
																							$elm$html$Html$text('Shape')
																						]))
																				])),
																			A2(
																			$elm$html$Html$select,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('form-control'),
																					$elm$html$Html$Events$onInput($author$project$Main$SetShape)
																				]),
																			A2(
																				$elm$core$List$indexedMap,
																				F2(
																					function (i, s) {
																						return A2(
																							$elm$html$Html$option,
																							_List_fromArray(
																								[
																									$elm$html$Html$Attributes$value(
																									$elm$core$String$fromInt(i))
																								]),
																							_List_fromArray(
																								[
																									$elm$html$Html$text(
																									$author$project$Netherite$shapeToString(s))
																								]));
																					}),
																				shape))
																		]))
																]))
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-footer')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('mr-auto btn btn-outline-danger'),
															$elm$html$Html$Events$onClick($author$project$Main$CancelModal)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Cancel')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('button'),
															$elm$html$Html$Attributes$class('btn btn-primary'),
															$elm$html$Html$Events$onClick($author$project$Main$Prove)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Prove')
														]))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-backdrop show'),
							$elm$html$Html$Attributes$id('error-modal-back')
						]),
					_List_Nil)
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$Main$view = function (model) {
	var proofTree = function () {
		var _v5 = model.l;
		switch (_v5.$) {
			case 1:
				var pt = _v5.a.L;
				if (!pt.$) {
					var proofStepState = pt.a;
					return $author$project$Main$drawProofStepState(proofStepState);
				} else {
					return _List_Nil;
				}
			case 2:
				var p = _v5.a;
				var _v7 = p.o;
				if (_v7.b) {
					var _v8 = _v7.a;
					var pt = _v8.b;
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('d-inline-block shape-container')
								]),
							A2(
								$elm$core$List$map,
								$elm$html$Html$map($author$project$Main$GenM),
								A2($author$project$Generalise$drawShapes, p.ap, pt)))
						]);
				} else {
					return _List_Nil;
				}
			default:
				return _List_Nil;
		}
	}();
	var proofState = function () {
		var _v4 = model.l;
		switch (_v4.$) {
			case 1:
				return 'Proven:';
			case 2:
				return 'Proving:';
			default:
				return '';
		}
	}();
	var operation = function () {
		var _v3 = model.l;
		if (_v3.$ === 2) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('input-group m-2 ')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input-group-prepend')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('input-group-text')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Operation:')
										]))
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-control input-group-text'),
									$elm$html$Html$Events$onInput($author$project$Main$SetOp)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('none'),
											$elm$html$Html$Attributes$selected(true)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('None')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitInnerSquare')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Inner Square')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('split4')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Four')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitEnds')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Ends')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitOuterFrame')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Outer Frame')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitFrame')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Frame')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitSquare')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Square')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitSide')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Side')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitTST')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split TST')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('splitDia')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Split Diagonal')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('lcut')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('L-Cut')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('rotate')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Rotate')
										]))
								]))
						]))
				]);
		} else {
			return _List_Nil;
		}
	}();
	var _new = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('m-2 btn-group')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$class('btn btn-primary'),
						$elm$html$Html$Attributes$value('New'),
						$elm$html$Html$Events$onClick($author$project$Main$NewProof)
					]),
				_List_Nil)
			]));
	var nVal = function () {
		var _v2 = model.l;
		switch (_v2.$) {
			case 1:
				var p = _v2.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control pr-0'),
								$elm$html$Html$Attributes$type_('number'),
								$elm$html$Html$Attributes$value(p.B),
								$elm$html$Html$Events$onInput($author$project$Main$SetN),
								A2(
								$elm$html$Html$Events$preventDefaultOn,
								'keydown',
								A2(
									$elm$json$Json$Decode$map,
									function (v) {
										return _Utils_Tuple2(v, true);
									},
									$author$project$Main$enterDecoder($author$project$Main$ShowProof)))
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-group-append')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Attributes$class('btn input-group-text'),
										$elm$html$Html$Attributes$value('↲'),
										$elm$html$Html$Events$onClick($author$project$Main$ShowProof)
									]),
								_List_Nil)
							]))
					]);
			case 0:
				return _List_Nil;
			default:
				var p = _v2.a;
				var current = A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						$elm$core$String$fromInt,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Tuple$first,
							$elm$core$List$head(p.o))));
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-control input-group-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(current)
							]))
					]);
		}
	}();
	var n = _Utils_eq(model.l, $author$project$Main$New) ? _List_Nil : _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('input-group m-2 ')
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-group-prepend')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('input-group-text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('n:')
									]))
							]))
					]),
				nVal))
		]);
	var formulaText = function () {
		var _v1 = model.l;
		switch (_v1.$) {
			case 1:
				var p = _v1.a;
				return p.E;
			case 2:
				var p = _v1.a;
				return p.E;
			default:
				return '';
		}
	}();
	var formula = _Utils_eq(model.l, $author$project$Main$New) ? _List_Nil : _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('input-group m-2 ')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('input-group-prepend')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input-group-text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(proofState)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-control input-group-text')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(formulaText)
						]))
				]))
		]);
	var done = function () {
		var _v0 = model.l;
		if (_v0.$ === 2) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('m-2 ml-auto btn-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('btn btn-success pull-right'),
									$elm$html$Html$Attributes$value('Done'),
									$elm$html$Html$Events$onClick($author$project$Main$Done)
								]),
							_List_Nil)
						]))
				]);
		} else {
			return _List_Nil;
		}
	}();
	return {
		bb: _Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$form,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('border-bottom form-inline m-0')
									]),
								_Utils_ap(
									_List_fromArray(
										[_new]),
									_Utils_ap(
										formula,
										_Utils_ap(
											n,
											_Utils_ap(operation, done)))))
							]),
						proofTree))
				]),
			$author$project$Main$showModal(model.v)),
		bu: 'Moissanite'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{bj: $author$project$Main$init, bt: $author$project$Main$subscriptions, bv: $author$project$Main$update, bw: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));