// We are modularizing this manually because the current modularize setting in Emscripten has some issues:
// https://github.com/kripken/emscripten/issues/5820
// In addition, When you use emcc's modularization, it still expects to export a global object called `Module`,
// which is able to be used/called before the WASM is loaded.
// The modularization below exports a promise that loads and resolves to the actual sql.js module.
// That way, this module can't be used before the WASM is finished loading.

// We are going to define a function that a user will call to start loading initializing our Sql.js library
// However, that function might be called multiple times, and on subsequent calls, we don't actually want it to instantiate a new instance of the Module
// Instead, we want to return the previously loaded module

// TODO: Make this not declare a global if used in the browser
var initSqlJsPromise = undefined

var initSqlJs = function (moduleConfig) {
    if (initSqlJsPromise) {
        return initSqlJsPromise
    }
    // If we're here, we've never called this function before
    initSqlJsPromise = new Promise(function (resolveModule, reject) {
        // We are modularizing this manually because the current modularize setting in Emscripten has some issues:
        // https://github.com/kripken/emscripten/issues/5820

        // The way to affect the loading of emcc compiled modules is to create a variable called `Module` and add
        // properties to it, like `preRun`, `postRun`, etc
        // We are using that to get notified when the WASM has finished loading.
        // Only then will we return our promise

        // If they passed in a moduleConfig object, use that
        // Otherwise, initialize Module to the empty object
        var Module = typeof moduleConfig !== 'undefined' ? moduleConfig : {}

        // EMCC only allows for a single onAbort function (not an array of functions)
        // So if the user defined their own onAbort function, we remember it and call it
        var originalOnAbortFunction = Module['onAbort']
        Module['onAbort'] = function (errorThatCausedAbort) {
            reject(new Error(errorThatCausedAbort))
            if (originalOnAbortFunction) {
                originalOnAbortFunction(errorThatCausedAbort)
            }
        }

        Module['postRun'] = Module['postRun'] || []
        Module['postRun'].push(function () {
            // When Emscripted calls postRun, this promise resolves with the built Module
            resolveModule(Module)
        })

        // There is a section of code in the emcc-generated code below that looks like this:
        // (Note that this is lowercase `module`)
        // if (typeof module !== 'undefined') {
        //     module['exports'] = Module;
        // }
        // When that runs, it's going to overwrite our own modularization export efforts in shell-post.js!
        // The only way to tell emcc not to emit it is to pass the MODULARIZE=1 or MODULARIZE_INSTANCE=1 flags,
        // but that carries with it additional unnecessary baggage/bugs we don't want either.
        // So, we have three options:
        // 1) We undefine `module`
        // 2) We remember what `module['exports']` was at the beginning of this function and we restore it later
        // 3) We write a script to remove those lines of code as part of the Make process.
        //
        // Since those are the only lines of code that care about module, we will undefine it. It's the most straightforward
        // of the options, and has the side effect of reducing emcc's efforts to modify the module if its output were to change in the future.
        // That's a nice side effect since we're handling the modularization efforts ourselves
        module = undefined

        // The emcc-generated code and shell-post.js code goes below,
        // meaning that all of it runs inside of this promise. If anything throws an exception, our promise will abort

        var Module
        Module || (Module = typeof Module !== 'undefined' ? Module : {})
        null
        Module.onRuntimeInitialized = function () {
            function a(h, m) {
                this.Qa = h
                this.db = m
                this.Pa = 1
                this.wb = []
            }
            function b(h, m) {
                this.db = m
                m = d(h) + 1
                this.hb = ba(m)
                if (null === this.hb)
                    throw Error('Unable to allocate memory for the SQL string')
                p(h, t, this.hb, m)
                this.sb = this.hb
                this.eb = this.Mb = null
            }
            function c(h, { filename: m = !1 } = {}) {
                !1 === m
                    ? ((this.filename =
                          'dbfile_' + ((4294967295 * Math.random()) >>> 0)),
                      (this.Yc = !0),
                      null != h && x.zb('/', this.filename, h, !0, !0))
                    : (this.filename = h)
                this.handleError(g(this.filename, e))
                this.db = z(e, 'i32')
                Db(this.db)
                this.nb = {}
                this.Xa = {}
            }
            var e = C(4),
                f = Module.cwrap,
                g = f('sqlite3_open', 'number', ['string', 'number']),
                k = f('sqlite3_close_v2', 'number', ['number']),
                l = f('sqlite3_exec', 'number', [
                    'number',
                    'string',
                    'number',
                    'number',
                    'number',
                ]),
                q = f('sqlite3_changes', 'number', ['number']),
                n = f('sqlite3_prepare_v2', 'number', [
                    'number',
                    'string',
                    'number',
                    'number',
                    'number',
                ]),
                r = f('sqlite3_sql', 'string', ['number']),
                w = f('sqlite3_normalized_sql', 'string', ['number']),
                B = f('sqlite3_prepare_v2', 'number', [
                    'number',
                    'number',
                    'number',
                    'number',
                    'number',
                ]),
                E = f('sqlite3_bind_text', 'number', [
                    'number',
                    'number',
                    'number',
                    'number',
                    'number',
                ]),
                A = f('sqlite3_bind_blob', 'number', [
                    'number',
                    'number',
                    'number',
                    'number',
                    'number',
                ]),
                J = f('sqlite3_bind_double', 'number', [
                    'number',
                    'number',
                    'number',
                ]),
                Z = f('sqlite3_bind_int', 'number', [
                    'number',
                    'number',
                    'number',
                ]),
                U = f('sqlite3_bind_parameter_index', 'number', [
                    'number',
                    'string',
                ]),
                Ka = f('sqlite3_step', 'number', ['number']),
                G = f('sqlite3_errmsg', 'string', ['number']),
                Eb = f('sqlite3_column_count', 'number', ['number']),
                Fb = f('sqlite3_data_count', 'number', ['number']),
                Gb = f('sqlite3_column_double', 'number', ['number', 'number']),
                db = f('sqlite3_column_text', 'string', ['number', 'number']),
                Hb = f('sqlite3_column_blob', 'number', ['number', 'number']),
                Ib = f('sqlite3_column_bytes', 'number', ['number', 'number']),
                Jb = f('sqlite3_column_type', 'number', ['number', 'number']),
                Kb = f('sqlite3_column_name', 'string', ['number', 'number']),
                Lb = f('sqlite3_reset', 'number', ['number']),
                Mb = f('sqlite3_clear_bindings', 'number', ['number']),
                Nb = f('sqlite3_finalize', 'number', ['number']),
                Ob = f(
                    'sqlite3_create_function_v2',
                    'number',
                    'number string number number number number number number number'.split(
                        ' '
                    )
                ),
                Pb = f('sqlite3_value_type', 'number', ['number']),
                Qb = f('sqlite3_value_bytes', 'number', ['number']),
                Rb = f('sqlite3_value_text', 'string', ['number']),
                Sb = f('sqlite3_value_blob', 'number', ['number']),
                Tb = f('sqlite3_value_double', 'number', ['number']),
                Ub = f('sqlite3_result_double', '', ['number', 'number']),
                eb = f('sqlite3_result_null', '', ['number']),
                Vb = f('sqlite3_result_text', '', [
                    'number',
                    'string',
                    'number',
                    'number',
                ]),
                Wb = f('sqlite3_result_blob', '', [
                    'number',
                    'number',
                    'number',
                    'number',
                ]),
                Xb = f('sqlite3_result_int', '', ['number', 'number']),
                fb = f('sqlite3_result_error', '', [
                    'number',
                    'string',
                    'number',
                ]),
                Db = f('RegisterExtensionFunctions', 'number', ['number'])
            a.prototype.bind = function (h) {
                if (!this.Qa) throw 'Statement closed'
                this.reset()
                return Array.isArray(h)
                    ? this.yc(h)
                    : null != h && 'object' === typeof h
                    ? this.zc(h)
                    : !0
            }
            a.prototype.step = function () {
                if (!this.Qa) throw 'Statement closed'
                this.Pa = 1
                var h = Ka(this.Qa)
                switch (h) {
                    case 100:
                        return !0
                    case 101:
                        return !1
                    default:
                        throw this.db.handleError(h)
                }
            }
            a.prototype.ec = function (h) {
                null == h && ((h = this.Pa), (this.Pa += 1))
                return Gb(this.Qa, h)
            }
            a.prototype.Pc = function (h) {
                null == h && ((h = this.Pa), (this.Pa += 1))
                h = db(this.Qa, h)
                if ('function' !== typeof BigInt)
                    throw Error('BigInt is not supported')
                return BigInt(h)
            }
            a.prototype.Rc = function (h) {
                null == h && ((h = this.Pa), (this.Pa += 1))
                return db(this.Qa, h)
            }
            a.prototype.getBlob = function (h) {
                null == h && ((h = this.Pa), (this.Pa += 1))
                var m = Ib(this.Qa, h)
                h = Hb(this.Qa, h)
                for (var u = new Uint8Array(m), v = 0; v < m; v += 1)
                    u[v] = D[h + v]
                return u
            }
            a.prototype.get = function (h, m) {
                m = m || {}
                null != h && this.bind(h) && this.step()
                h = []
                for (var u = Fb(this.Qa), v = 0; v < u; v += 1)
                    switch (Jb(this.Qa, v)) {
                        case 1:
                            var y = m.useBigInt ? this.Pc(v) : this.ec(v)
                            h.push(y)
                            break
                        case 2:
                            h.push(this.ec(v))
                            break
                        case 3:
                            h.push(this.Rc(v))
                            break
                        case 4:
                            h.push(this.getBlob(v))
                            break
                        default:
                            h.push(null)
                    }
                return h
            }
            a.prototype.getColumnNames = function () {
                for (var h = [], m = Eb(this.Qa), u = 0; u < m; u += 1)
                    h.push(Kb(this.Qa, u))
                return h
            }
            a.prototype.getAsObject = function (h, m) {
                h = this.get(h, m)
                m = this.getColumnNames()
                for (var u = {}, v = 0; v < m.length; v += 1) u[m[v]] = h[v]
                return u
            }
            a.prototype.getSQL = function () {
                return r(this.Qa)
            }
            a.prototype.getNormalizedSQL = function () {
                return w(this.Qa)
            }
            a.prototype.run = function (h) {
                null != h && this.bind(h)
                this.step()
                return this.reset()
            }
            a.prototype.Ub = function (h, m) {
                null == m && ((m = this.Pa), (this.Pa += 1))
                h = ca(h)
                var u = da(h)
                this.wb.push(u)
                this.db.handleError(E(this.Qa, m, u, h.length - 1, 0))
            }
            a.prototype.xc = function (h, m) {
                null == m && ((m = this.Pa), (this.Pa += 1))
                var u = da(h)
                this.wb.push(u)
                this.db.handleError(A(this.Qa, m, u, h.length, 0))
            }
            a.prototype.Tb = function (h, m) {
                null == m && ((m = this.Pa), (this.Pa += 1))
                this.db.handleError((h === (h | 0) ? Z : J)(this.Qa, m, h))
            }
            a.prototype.Ac = function (h) {
                null == h && ((h = this.Pa), (this.Pa += 1))
                A(this.Qa, h, 0, 0, 0)
            }
            a.prototype.Vb = function (h, m) {
                null == m && ((m = this.Pa), (this.Pa += 1))
                switch (typeof h) {
                    case 'string':
                        this.Ub(h, m)
                        return
                    case 'number':
                        this.Tb(h, m)
                        return
                    case 'bigint':
                        this.Ub(h.toString(), m)
                        return
                    case 'boolean':
                        this.Tb(h + 0, m)
                        return
                    case 'object':
                        if (null === h) {
                            this.Ac(m)
                            return
                        }
                        if (null != h.length) {
                            this.xc(h, m)
                            return
                        }
                }
                throw (
                    'Wrong API use : tried to bind a value of an unknown type (' +
                    h +
                    ').'
                )
            }
            a.prototype.zc = function (h) {
                var m = this
                Object.keys(h).forEach(function (u) {
                    var v = U(m.Qa, u)
                    0 !== v && m.Vb(h[u], v)
                })
                return !0
            }
            a.prototype.yc = function (h) {
                for (var m = 0; m < h.length; m += 1) this.Vb(h[m], m + 1)
                return !0
            }
            a.prototype.reset = function () {
                this.freemem()
                return 0 === Mb(this.Qa) && 0 === Lb(this.Qa)
            }
            a.prototype.freemem = function () {
                for (var h; void 0 !== (h = this.wb.pop()); ) ea(h)
            }
            a.prototype.free = function () {
                this.freemem()
                var h = 0 === Nb(this.Qa)
                delete this.db.nb[this.Qa]
                this.Qa = 0
                return h
            }
            b.prototype.next = function () {
                if (null === this.hb) return { done: !0 }
                null !== this.eb && (this.eb.free(), (this.eb = null))
                if (!this.db.db) throw (this.Bb(), Error('Database closed'))
                var h = ha(),
                    m = C(4)
                ia(e)
                ia(m)
                try {
                    this.db.handleError(B(this.db.db, this.sb, -1, e, m))
                    this.sb = z(m, 'i32')
                    var u = z(e, 'i32')
                    if (0 === u) return this.Bb(), { done: !0 }
                    this.eb = new a(u, this.db)
                    this.db.nb[u] = this.eb
                    return { value: this.eb, done: !1 }
                } catch (v) {
                    throw ((this.Mb = F(this.sb)), this.Bb(), v)
                } finally {
                    ja(h)
                }
            }
            b.prototype.Bb = function () {
                ea(this.hb)
                this.hb = null
            }
            b.prototype.getRemainingSQL = function () {
                return null !== this.Mb ? this.Mb : F(this.sb)
            }
            'function' === typeof Symbol &&
                'symbol' === typeof Symbol.iterator &&
                (b.prototype[Symbol.iterator] = function () {
                    return this
                })
            c.prototype.run = function (h, m) {
                if (!this.db) throw 'Database closed'
                if (m) {
                    h = this.prepare(h, m)
                    try {
                        h.step()
                    } finally {
                        h.free()
                    }
                } else this.handleError(l(this.db, h, 0, 0, e))
                return this
            }
            c.prototype.exec = function (h, m, u) {
                if (!this.db) throw 'Database closed'
                var v = ha(),
                    y = null
                try {
                    var H = d(h) + 1,
                        K = C(H)
                    p(h, D, K, H)
                    var fa = K
                    var aa = C(4)
                    for (h = []; 0 !== z(fa, 'i8'); ) {
                        ia(e)
                        ia(aa)
                        this.handleError(B(this.db, fa, -1, e, aa))
                        var I = z(e, 'i32')
                        fa = z(aa, 'i32')
                        if (0 !== I) {
                            H = null
                            y = new a(I, this)
                            for (null != m && y.bind(m); y.step(); )
                                null === H &&
                                    ((H = {
                                        columns: y.getColumnNames(),
                                        values: [],
                                    }),
                                    h.push(H)),
                                    H.values.push(y.get(null, u))
                            y.free()
                        }
                    }
                    return h
                } catch (O) {
                    throw (y && y.free(), O)
                } finally {
                    ja(v)
                }
            }
            c.prototype.each = function (h, m, u, v, y) {
                'function' === typeof m && ((v = u), (u = m), (m = void 0))
                h = this.prepare(h, m)
                try {
                    for (; h.step(); ) u(h.getAsObject(null, y))
                } finally {
                    h.free()
                }
                if ('function' === typeof v) return v()
            }
            c.prototype.prepare = function (h, m) {
                ia(e)
                this.handleError(n(this.db, h, -1, e, 0))
                h = z(e, 'i32')
                if (0 === h) throw 'Nothing to prepare'
                var u = new a(h, this)
                null != m && u.bind(m)
                return (this.nb[h] = u)
            }
            c.prototype.iterateStatements = function (h) {
                return new b(h, this)
            }
            c.prototype['export'] = function () {
                Object.values(this.nb).forEach(function (m) {
                    m.free()
                })
                Object.values(this.Xa).forEach(ka)
                this.Xa = {}
                this.handleError(k(this.db))
                var h = x.readFile(this.filename, { encoding: 'binary' })
                this.handleError(g(this.filename, e))
                this.db = z(e, 'i32')
                return h
            }
            c.prototype.close = function () {
                null !== this.db &&
                    (Object.values(this.nb).forEach(function (h) {
                        h.free()
                    }),
                    Object.values(this.Xa).forEach(ka),
                    (this.Xa = {}),
                    this.handleError(k(this.db)),
                    this.Yc && x.unlink('/' + this.filename),
                    (this.db = null))
            }
            c.prototype.handleError = function (h) {
                if (0 === h) return null
                h = G(this.db)
                throw Error(h)
            }
            c.prototype.getRowsModified = function () {
                return q(this.db)
            }
            c.prototype.create_function = function (h, m) {
                Object.prototype.hasOwnProperty.call(this.Xa, h) &&
                    (ka(this.Xa[h]), delete this.Xa[h])
                var u = la(function (v, y, H) {
                    for (var K, fa = [], aa = 0; aa < y; aa += 1) {
                        var I = z(H + 4 * aa, 'i32'),
                            O = Pb(I)
                        if (1 === O || 2 === O) I = Tb(I)
                        else if (3 === O) I = Rb(I)
                        else if (4 === O) {
                            O = I
                            I = Qb(O)
                            O = Sb(O)
                            for (
                                var gb = new Uint8Array(I), Aa = 0;
                                Aa < I;
                                Aa += 1
                            )
                                gb[Aa] = D[O + Aa]
                            I = gb
                        } else I = null
                        fa.push(I)
                    }
                    try {
                        K = m.apply(null, fa)
                    } catch (Yb) {
                        fb(v, Yb, -1)
                        return
                    }
                    switch (typeof K) {
                        case 'boolean':
                            Xb(v, K ? 1 : 0)
                            break
                        case 'number':
                            Ub(v, K)
                            break
                        case 'string':
                            Vb(v, K, -1, -1)
                            break
                        case 'object':
                            null === K
                                ? eb(v)
                                : null != K.length
                                ? ((y = da(K)), Wb(v, y, K.length, -1), ea(y))
                                : fb(
                                      v,
                                      'Wrong API use : tried to return a value of an unknown type (' +
                                          K +
                                          ').',
                                      -1
                                  )
                            break
                        default:
                            eb(v)
                    }
                }, 'viii')
                this.Xa[h] = u
                this.handleError(Ob(this.db, h, m.length, 1, 0, u, 0, 0, 0))
                return this
            }
            Module.Database = c
            var ra = new Map()
            Module.register_for_idb = (h) => {
                let m = la(function (y, H) {
                        y = ra.get(y)
                        return h.lock(y, H) ? 0 : 5
                    }, 'iii'),
                    u = la(function (y, H) {
                        y = ra.get(y)
                        h.unlock(y, H)
                        return 0
                    }, 'iii'),
                    v = la(function (y, H) {
                        y = F(y)
                        ra.set(H, y)
                    }, 'vii')
                Module._register_for_idb(m, u, v)
            }
            Module.cleanup_file = (h) => {
                let m = [...ra.entries()].find((u) => u[1] === h)
                ra.delete(m[0])
            }
            Module.reset_filesystem = () => {
                x.root = null
                x.oc()
            }
        }
        var ma = {},
            L
        for (L in Module) Module.hasOwnProperty(L) && (ma[L] = Module[L])
        var na = './this.program',
            oa = 'object' === typeof window,
            pa = 'function' === typeof importScripts,
            qa =
                'object' === typeof process &&
                'object' === typeof process.versions &&
                'string' === typeof process.versions.node,
            M = '',
            sa,
            ta,
            ua,
            va,
            wa
        if (qa)
            (M = pa ? require('path').dirname(M) + '/' : __dirname + '/'),
                (sa = function (a, b) {
                    va || (va = require('fs'))
                    wa || (wa = require('path'))
                    a = wa.normalize(a)
                    return va.readFileSync(a, b ? null : 'utf8')
                }),
                (ua = function (a) {
                    a = sa(a, !0)
                    a.buffer || (a = new Uint8Array(a))
                    assert(a.buffer)
                    return a
                }),
                (ta = function (a, b, c) {
                    va || (va = require('fs'))
                    wa || (wa = require('path'))
                    a = wa.normalize(a)
                    va.readFile(a, function (e, f) {
                        e ? c(e) : b(f.buffer)
                    })
                }),
                1 < process.argv.length &&
                    (na = process.argv[1].replace(/\\/g, '/')),
                process.argv.slice(2),
                'undefined' !== typeof module && (module.exports = Module),
                (Module.inspect = function () {
                    return '[Emscripten Module object]'
                })
        else if (oa || pa)
            pa
                ? (M = self.location.href)
                : 'undefined' !== typeof document &&
                  document.currentScript &&
                  (M = document.currentScript.src),
                (M =
                    0 !== M.indexOf('blob:')
                        ? M.substr(0, M.lastIndexOf('/') + 1)
                        : ''),
                (sa = function (a) {
                    var b = new XMLHttpRequest()
                    b.open('GET', a, !1)
                    b.send(null)
                    return b.responseText
                }),
                pa &&
                    (ua = function (a) {
                        var b = new XMLHttpRequest()
                        b.open('GET', a, !1)
                        b.responseType = 'arraybuffer'
                        b.send(null)
                        return new Uint8Array(b.response)
                    }),
                (ta = function (a, b, c) {
                    var e = new XMLHttpRequest()
                    e.open('GET', a, !0)
                    e.responseType = 'arraybuffer'
                    e.onload = function () {
                        200 == e.status || (0 == e.status && e.response)
                            ? b(e.response)
                            : c()
                    }
                    e.onerror = c
                    e.send(null)
                })
        var xa = Module.print || console.log.bind(console),
            N = Module.printErr || console.warn.bind(console)
        for (L in ma) ma.hasOwnProperty(L) && (Module[L] = ma[L])
        ma = null
        Module.thisProgram && (na = Module.thisProgram)
        var ya = [],
            za
        function ka(a) {
            za.delete(P.get(a))
            ya.push(a)
        }
        function la(a, b) {
            if (!za) {
                za = new WeakMap()
                for (var c = 0; c < P.length; c++) {
                    var e = P.get(c)
                    e && za.set(e, c)
                }
            }
            if (za.has(a)) a = za.get(a)
            else {
                if (ya.length) c = ya.pop()
                else {
                    try {
                        P.grow(1)
                    } catch (l) {
                        if (!(l instanceof RangeError)) throw l
                        throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.'
                    }
                    c = P.length - 1
                }
                try {
                    P.set(c, a)
                } catch (l) {
                    if (!(l instanceof TypeError)) throw l
                    if ('function' === typeof WebAssembly.Function) {
                        var f = { i: 'i32', j: 'i64', f: 'f32', d: 'f64' },
                            g = {
                                parameters: [],
                                results: 'v' == b[0] ? [] : [f[b[0]]],
                            }
                        for (e = 1; e < b.length; ++e)
                            g.parameters.push(f[b[e]])
                        b = new WebAssembly.Function(g, a)
                    } else {
                        f = [1, 0, 1, 96]
                        g = b.slice(0, 1)
                        b = b.slice(1)
                        var k = { i: 127, j: 126, f: 125, d: 124 }
                        f.push(b.length)
                        for (e = 0; e < b.length; ++e) f.push(k[b[e]])
                        'v' == g ? f.push(0) : (f = f.concat([1, k[g]]))
                        f[1] = f.length - 2
                        b = new Uint8Array(
                            [0, 97, 115, 109, 1, 0, 0, 0].concat(
                                f,
                                [
                                    2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1,
                                    102, 0, 0,
                                ]
                            )
                        )
                        b = new WebAssembly.Module(b)
                        b = new WebAssembly.Instance(b, { e: { f: a } }).exports
                            .f
                    }
                    P.set(c, b)
                }
                za.set(a, c)
                a = c
            }
            return a
        }
        var Ba
        Module.wasmBinary && (Ba = Module.wasmBinary)
        var noExitRuntime = Module.noExitRuntime || !0
        'object' !== typeof WebAssembly && Q('no native wasm support detected')
        function ia(a) {
            var b = 'i32'
            '*' === b.charAt(b.length - 1) && (b = 'i32')
            switch (b) {
                case 'i1':
                    D[a >> 0] = 0
                    break
                case 'i8':
                    D[a >> 0] = 0
                    break
                case 'i16':
                    Ca[a >> 1] = 0
                    break
                case 'i32':
                    R[a >> 2] = 0
                    break
                case 'i64':
                    S = [
                        0,
                        ((T = 0),
                        1 <= +Math.abs(T)
                            ? 0 < T
                                ? (Math.min(
                                      +Math.floor(T / 4294967296),
                                      4294967295
                                  ) |
                                      0) >>>
                                  0
                                : ~~+Math.ceil(
                                      (T - +(~~T >>> 0)) / 4294967296
                                  ) >>> 0
                            : 0),
                    ]
                    R[a >> 2] = S[0]
                    R[(a + 4) >> 2] = S[1]
                    break
                case 'float':
                    Da[a >> 2] = 0
                    break
                case 'double':
                    Ea[a >> 3] = 0
                    break
                default:
                    Q('invalid type for setValue: ' + b)
            }
        }
        function z(a, b) {
            b = b || 'i8'
            '*' === b.charAt(b.length - 1) && (b = 'i32')
            switch (b) {
                case 'i1':
                    return D[a >> 0]
                case 'i8':
                    return D[a >> 0]
                case 'i16':
                    return Ca[a >> 1]
                case 'i32':
                    return R[a >> 2]
                case 'i64':
                    return R[a >> 2]
                case 'float':
                    return Da[a >> 2]
                case 'double':
                    return Ea[a >> 3]
                default:
                    Q('invalid type for getValue: ' + b)
            }
            return null
        }
        var Fa,
            Ga = !1
        function assert(a, b) {
            a || Q('Assertion failed: ' + b)
        }
        function Ha(a) {
            var b = Module['_' + a]
            assert(
                b,
                'Cannot call unknown function ' +
                    a +
                    ', make sure it is exported'
            )
            return b
        }
        function Ia(a, b, c, e) {
            var f = {
                string: function (n) {
                    var r = 0
                    if (null !== n && void 0 !== n && 0 !== n) {
                        var w = (n.length << 2) + 1
                        r = C(w)
                        p(n, t, r, w)
                    }
                    return r
                },
                array: function (n) {
                    var r = C(n.length)
                    D.set(n, r)
                    return r
                },
            }
            a = Ha(a)
            var g = [],
                k = 0
            if (e)
                for (var l = 0; l < e.length; l++) {
                    var q = f[c[l]]
                    q
                        ? (0 === k && (k = ha()), (g[l] = q(e[l])))
                        : (g[l] = e[l])
                }
            c = a.apply(null, g)
            return (c = (function (n) {
                0 !== k && ja(k)
                return 'string' === b ? F(n) : 'boolean' === b ? !!n : n
            })(c))
        }
        var Ja = 0,
            La = 1
        function da(a) {
            var b = Ja == La ? C(a.length) : ba(a.length)
            a.subarray || a.slice ? t.set(a, b) : t.set(new Uint8Array(a), b)
            return b
        }
        var Ma =
            'undefined' !== typeof TextDecoder
                ? new TextDecoder('utf8')
                : void 0
        function Na(a, b, c) {
            var e = b + c
            for (c = b; a[c] && !(c >= e); ) ++c
            if (16 < c - b && a.subarray && Ma)
                return Ma.decode(a.subarray(b, c))
            for (e = ''; b < c; ) {
                var f = a[b++]
                if (f & 128) {
                    var g = a[b++] & 63
                    if (192 == (f & 224))
                        e += String.fromCharCode(((f & 31) << 6) | g)
                    else {
                        var k = a[b++] & 63
                        f =
                            224 == (f & 240)
                                ? ((f & 15) << 12) | (g << 6) | k
                                : ((f & 7) << 18) |
                                  (g << 12) |
                                  (k << 6) |
                                  (a[b++] & 63)
                        65536 > f
                            ? (e += String.fromCharCode(f))
                            : ((f -= 65536),
                              (e += String.fromCharCode(
                                  55296 | (f >> 10),
                                  56320 | (f & 1023)
                              )))
                    }
                } else e += String.fromCharCode(f)
            }
            return e
        }
        function F(a, b) {
            return a ? Na(t, a, b) : ''
        }
        function p(a, b, c, e) {
            if (!(0 < e)) return 0
            var f = c
            e = c + e - 1
            for (var g = 0; g < a.length; ++g) {
                var k = a.charCodeAt(g)
                if (55296 <= k && 57343 >= k) {
                    var l = a.charCodeAt(++g)
                    k = (65536 + ((k & 1023) << 10)) | (l & 1023)
                }
                if (127 >= k) {
                    if (c >= e) break
                    b[c++] = k
                } else {
                    if (2047 >= k) {
                        if (c + 1 >= e) break
                        b[c++] = 192 | (k >> 6)
                    } else {
                        if (65535 >= k) {
                            if (c + 2 >= e) break
                            b[c++] = 224 | (k >> 12)
                        } else {
                            if (c + 3 >= e) break
                            b[c++] = 240 | (k >> 18)
                            b[c++] = 128 | ((k >> 12) & 63)
                        }
                        b[c++] = 128 | ((k >> 6) & 63)
                    }
                    b[c++] = 128 | (k & 63)
                }
            }
            b[c] = 0
            return c - f
        }
        function d(a) {
            for (var b = 0, c = 0; c < a.length; ++c) {
                var e = a.charCodeAt(c)
                55296 <= e &&
                    57343 >= e &&
                    (e =
                        (65536 + ((e & 1023) << 10)) |
                        (a.charCodeAt(++c) & 1023))
                127 >= e
                    ? ++b
                    : (b = 2047 >= e ? b + 2 : 65535 >= e ? b + 3 : b + 4)
            }
            return b
        }
        function Oa(a) {
            var b = d(a) + 1,
                c = ba(b)
            c && p(a, D, c, b)
            return c
        }
        var Pa, D, t, Ca, R, Da, Ea
        function Qa() {
            var a = Fa.buffer
            Pa = a
            Module.HEAP8 = D = new Int8Array(a)
            Module.HEAP16 = Ca = new Int16Array(a)
            Module.HEAP32 = R = new Int32Array(a)
            Module.HEAPU8 = t = new Uint8Array(a)
            Module.HEAPU16 = new Uint16Array(a)
            Module.HEAPU32 = new Uint32Array(a)
            Module.HEAPF32 = Da = new Float32Array(a)
            Module.HEAPF64 = Ea = new Float64Array(a)
        }
        var P,
            Ra = [],
            Sa = [],
            Ta = []
        function Ua() {
            var a = Module.preRun.shift()
            Ra.unshift(a)
        }
        var Va = 0,
            Wa = null,
            Xa = null
        function Ya() {
            Va++
            Module.monitorRunDependencies && Module.monitorRunDependencies(Va)
        }
        function Za() {
            Va--
            Module.monitorRunDependencies && Module.monitorRunDependencies(Va)
            if (
                0 == Va &&
                (null !== Wa && (clearInterval(Wa), (Wa = null)), Xa)
            ) {
                var a = Xa
                Xa = null
                a()
            }
        }
        Module.preloadedImages = {}
        Module.preloadedAudios = {}
        function Q(a) {
            if (Module.onAbort) Module.onAbort(a)
            N(a)
            Ga = !0
            throw new WebAssembly.RuntimeError(
                'abort(' + a + '). Build with -s ASSERTIONS=1 for more info.'
            )
        }
        function $a() {
            return V.startsWith('data:application/octet-stream;base64,')
        }
        var V
        V = 'sql-wasm.wasm'
        if (!$a()) {
            var ab = V
            V = Module.locateFile ? Module.locateFile(ab, M) : M + ab
        }
        function bb() {
            var a = V
            try {
                if (a == V && Ba) return new Uint8Array(Ba)
                if (ua) return ua(a)
                throw 'both async and sync fetching of the wasm failed'
            } catch (b) {
                Q(b)
            }
        }
        function cb() {
            if (!Ba && (oa || pa)) {
                if ('function' === typeof fetch && !V.startsWith('file://'))
                    return fetch(V, { credentials: 'same-origin' })
                        .then(function (a) {
                            if (!a.ok)
                                throw (
                                    "failed to load wasm binary file at '" +
                                    V +
                                    "'"
                                )
                            return a.arrayBuffer()
                        })
                        .catch(function () {
                            return bb()
                        })
                if (ta)
                    return new Promise(function (a, b) {
                        ta(
                            V,
                            function (c) {
                                a(new Uint8Array(c))
                            },
                            b
                        )
                    })
            }
            return Promise.resolve().then(function () {
                return bb()
            })
        }
        var T, S
        function hb(a) {
            for (; 0 < a.length; ) {
                var b = a.shift()
                if ('function' == typeof b) b(Module)
                else {
                    var c = b.qd
                    'number' === typeof c
                        ? void 0 === b.yb
                            ? P.get(c)()
                            : P.get(c)(b.yb)
                        : c(void 0 === b.yb ? null : b.yb)
                }
            }
        }
        function ib(a) {
            return a.replace(/\b_Z[\w\d_]+/g, function (b) {
                return b === b ? b : b + ' [' + b + ']'
            })
        }
        function jb() {
            function a(k) {
                return (k = k.toTimeString().match(/\(([A-Za-z ]+)\)$/))
                    ? k[1]
                    : 'GMT'
            }
            var b = new Date().getFullYear(),
                c = new Date(b, 0, 1),
                e = new Date(b, 6, 1)
            b = c.getTimezoneOffset()
            var f = e.getTimezoneOffset(),
                g = Math.max(b, f)
            R[kb() >> 2] = 60 * g
            R[lb() >> 2] = Number(b != f)
            c = a(c)
            e = a(e)
            c = Oa(c)
            e = Oa(e)
            f < b
                ? ((R[mb() >> 2] = c), (R[(mb() + 4) >> 2] = e))
                : ((R[mb() >> 2] = e), (R[(mb() + 4) >> 2] = c))
        }
        var nb
        function ob(a, b) {
            for (var c = 0, e = a.length - 1; 0 <= e; e--) {
                var f = a[e]
                '.' === f
                    ? a.splice(e, 1)
                    : '..' === f
                    ? (a.splice(e, 1), c++)
                    : c && (a.splice(e, 1), c--)
            }
            if (b) for (; c; c--) a.unshift('..')
            return a
        }
        function pb(a) {
            var b = '/' === a.charAt(0),
                c = '/' === a.substr(-1)
            ;(a = ob(
                a.split('/').filter(function (e) {
                    return !!e
                }),
                !b
            ).join('/')) ||
                b ||
                (a = '.')
            a && c && (a += '/')
            return (b ? '/' : '') + a
        }
        function qb(a) {
            var b =
                /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                    .exec(a)
                    .slice(1)
            a = b[0]
            b = b[1]
            if (!a && !b) return '.'
            b && (b = b.substr(0, b.length - 1))
            return a + b
        }
        function W(a) {
            if ('/' === a) return '/'
            a = pb(a)
            a = a.replace(/\/$/, '')
            var b = a.lastIndexOf('/')
            return -1 === b ? a : a.substr(b + 1)
        }
        function rb(a, b) {
            return pb(a + '/' + b)
        }
        function sb() {
            if (
                'object' === typeof crypto &&
                'function' === typeof crypto.getRandomValues
            ) {
                var a = new Uint8Array(1)
                return function () {
                    crypto.getRandomValues(a)
                    return a[0]
                }
            }
            if (qa)
                try {
                    var b = require('crypto')
                    return function () {
                        return b.randomBytes(1)[0]
                    }
                } catch (c) {}
            return function () {
                Q('randomDevice')
            }
        }
        function tb() {
            for (
                var a = '', b = !1, c = arguments.length - 1;
                -1 <= c && !b;
                c--
            ) {
                b = 0 <= c ? arguments[c] : x.cwd()
                if ('string' !== typeof b)
                    throw new TypeError(
                        'Arguments to path.resolve must be strings'
                    )
                if (!b) return ''
                a = b + '/' + a
                b = '/' === b.charAt(0)
            }
            a = ob(
                a.split('/').filter(function (e) {
                    return !!e
                }),
                !b
            ).join('/')
            return (b ? '/' : '') + a || '.'
        }
        function ub(a, b) {
            function c(k) {
                for (var l = 0; l < k.length && '' === k[l]; l++);
                for (var q = k.length - 1; 0 <= q && '' === k[q]; q--);
                return l > q ? [] : k.slice(l, q - l + 1)
            }
            a = tb(a).substr(1)
            b = tb(b).substr(1)
            a = c(a.split('/'))
            b = c(b.split('/'))
            for (var e = Math.min(a.length, b.length), f = e, g = 0; g < e; g++)
                if (a[g] !== b[g]) {
                    f = g
                    break
                }
            e = []
            for (g = f; g < a.length; g++) e.push('..')
            e = e.concat(b.slice(f))
            return e.join('/')
        }
        var vb = []
        function wb(a, b) {
            vb[a] = { input: [], output: [], gb: b }
            x.Qb(a, xb)
        }
        var xb = {
                open: function (a) {
                    var b = vb[a.node.rdev]
                    if (!b) throw new x.ErrnoError(43)
                    a.tty = b
                    a.seekable = !1
                },
                close: function (a) {
                    a.tty.gb.flush(a.tty)
                },
                flush: function (a) {
                    a.tty.gb.flush(a.tty)
                },
                read: function (a, b, c, e) {
                    if (!a.tty || !a.tty.gb.fc) throw new x.ErrnoError(60)
                    for (var f = 0, g = 0; g < e; g++) {
                        try {
                            var k = a.tty.gb.fc(a.tty)
                        } catch (l) {
                            throw new x.ErrnoError(29)
                        }
                        if (void 0 === k && 0 === f) throw new x.ErrnoError(6)
                        if (null === k || void 0 === k) break
                        f++
                        b[c + g] = k
                    }
                    f && (a.node.timestamp = Date.now())
                    return f
                },
                write: function (a, b, c, e) {
                    if (!a.tty || !a.tty.gb.Nb) throw new x.ErrnoError(60)
                    try {
                        for (var f = 0; f < e; f++) a.tty.gb.Nb(a.tty, b[c + f])
                    } catch (g) {
                        throw new x.ErrnoError(29)
                    }
                    e && (a.node.timestamp = Date.now())
                    return f
                },
            },
            yb = {
                fc: function (a) {
                    if (!a.input.length) {
                        var b = null
                        if (qa) {
                            var c = Buffer.alloc(256),
                                e = 0
                            try {
                                e = va.readSync(
                                    process.stdin.fd,
                                    c,
                                    0,
                                    256,
                                    null
                                )
                            } catch (f) {
                                if (f.toString().includes('EOF')) e = 0
                                else throw f
                            }
                            0 < e
                                ? (b = c.slice(0, e).toString('utf-8'))
                                : (b = null)
                        } else
                            'undefined' != typeof window &&
                            'function' == typeof window.prompt
                                ? ((b = window.prompt('Input: ')),
                                  null !== b && (b += '\n'))
                                : 'function' == typeof readline &&
                                  ((b = readline()), null !== b && (b += '\n'))
                        if (!b) return null
                        a.input = ca(b, !0)
                    }
                    return a.input.shift()
                },
                Nb: function (a, b) {
                    null === b || 10 === b
                        ? (xa(Na(a.output, 0)), (a.output = []))
                        : 0 != b && a.output.push(b)
                },
                flush: function (a) {
                    a.output &&
                        0 < a.output.length &&
                        (xa(Na(a.output, 0)), (a.output = []))
                },
            },
            zb = {
                Nb: function (a, b) {
                    null === b || 10 === b
                        ? (N(Na(a.output, 0)), (a.output = []))
                        : 0 != b && a.output.push(b)
                },
                flush: function (a) {
                    a.output &&
                        0 < a.output.length &&
                        (N(Na(a.output, 0)), (a.output = []))
                },
            }
        function Ab(a) {
            a = 65536 * Math.ceil(a / 65536)
            var b = Bb(65536, a)
            if (!b) return 0
            t.fill(0, b, b + a)
            return b
        }
        var X = {
            Va: null,
            mount: function () {
                return X.createNode(null, '/', 16895, 0)
            },
            createNode: function (a, b, c, e) {
                if (x.Sc(c) || x.isFIFO(c)) throw new x.ErrnoError(63)
                X.Va ||
                    (X.Va = {
                        dir: {
                            node: {
                                getattr: X.node_ops.getattr,
                                setattr: X.node_ops.setattr,
                                lookup: X.node_ops.lookup,
                                mknod: X.node_ops.mknod,
                                rename: X.node_ops.rename,
                                unlink: X.node_ops.unlink,
                                rmdir: X.node_ops.rmdir,
                                readdir: X.node_ops.readdir,
                                symlink: X.node_ops.symlink,
                            },
                            stream: { llseek: X.stream_ops.llseek },
                        },
                        file: {
                            node: {
                                getattr: X.node_ops.getattr,
                                setattr: X.node_ops.setattr,
                            },
                            stream: {
                                llseek: X.stream_ops.llseek,
                                read: X.stream_ops.read,
                                write: X.stream_ops.write,
                                allocate: X.stream_ops.allocate,
                                mmap: X.stream_ops.mmap,
                                msync: X.stream_ops.msync,
                            },
                        },
                        link: {
                            node: {
                                getattr: X.node_ops.getattr,
                                setattr: X.node_ops.setattr,
                                readlink: X.node_ops.readlink,
                            },
                            stream: {},
                        },
                        Xb: {
                            node: {
                                getattr: X.node_ops.getattr,
                                setattr: X.node_ops.setattr,
                            },
                            stream: x.Dc,
                        },
                    })
                c = x.createNode(a, b, c, e)
                x.isDir(c.mode)
                    ? ((c.node_ops = X.Va.dir.node),
                      (c.stream_ops = X.Va.dir.stream),
                      (c.Na = {}))
                    : x.isFile(c.mode)
                    ? ((c.node_ops = X.Va.file.node),
                      (c.stream_ops = X.Va.file.stream),
                      (c.Ra = 0),
                      (c.Na = null))
                    : x.fb(c.mode)
                    ? ((c.node_ops = X.Va.link.node),
                      (c.stream_ops = X.Va.link.stream))
                    : x.pb(c.mode) &&
                      ((c.node_ops = X.Va.Xb.node),
                      (c.stream_ops = X.Va.Xb.stream))
                c.timestamp = Date.now()
                a && ((a.Na[b] = c), (a.timestamp = c.timestamp))
                return c
            },
            rd: function (a) {
                return a.Na
                    ? a.Na.subarray
                        ? a.Na.subarray(0, a.Ra)
                        : new Uint8Array(a.Na)
                    : new Uint8Array(0)
            },
            ac: function (a, b) {
                var c = a.Na ? a.Na.length : 0
                c >= b ||
                    ((b = Math.max(b, (c * (1048576 > c ? 2 : 1.125)) >>> 0)),
                    0 != c && (b = Math.max(b, 256)),
                    (c = a.Na),
                    (a.Na = new Uint8Array(b)),
                    0 < a.Ra && a.Na.set(c.subarray(0, a.Ra), 0))
            },
            hd: function (a, b) {
                if (a.Ra != b)
                    if (0 == b) (a.Na = null), (a.Ra = 0)
                    else {
                        var c = a.Na
                        a.Na = new Uint8Array(b)
                        c && a.Na.set(c.subarray(0, Math.min(b, a.Ra)))
                        a.Ra = b
                    }
            },
            node_ops: {
                getattr: function (a) {
                    var b = {}
                    b.dev = x.pb(a.mode) ? a.id : 1
                    b.ino = a.id
                    b.mode = a.mode
                    b.nlink = 1
                    b.uid = 0
                    b.gid = 0
                    b.rdev = a.rdev
                    x.isDir(a.mode)
                        ? (b.size = 4096)
                        : x.isFile(a.mode)
                        ? (b.size = a.Ra)
                        : x.fb(a.mode)
                        ? (b.size = a.link.length)
                        : (b.size = 0)
                    b.atime = new Date(a.timestamp)
                    b.mtime = new Date(a.timestamp)
                    b.ctime = new Date(a.timestamp)
                    b.Bc = 4096
                    b.blocks = Math.ceil(b.size / b.Bc)
                    return b
                },
                setattr: function (a, b) {
                    void 0 !== b.mode && (a.mode = b.mode)
                    void 0 !== b.timestamp && (a.timestamp = b.timestamp)
                    void 0 !== b.size && X.hd(a, b.size)
                },
                lookup: function () {
                    throw x.Db[44]
                },
                mknod: function (a, b, c, e) {
                    return X.createNode(a, b, c, e)
                },
                rename: function (a, b, c) {
                    if (x.isDir(a.mode)) {
                        try {
                            var e = x.lookupNode(b, c)
                        } catch (g) {}
                        if (e) for (var f in e.Na) throw new x.ErrnoError(55)
                    }
                    delete a.parent.Na[a.name]
                    a.parent.timestamp = Date.now()
                    a.name = c
                    b.Na[c] = a
                    b.timestamp = a.parent.timestamp
                    a.parent = b
                },
                unlink: function (a, b) {
                    delete a.Na[b]
                    a.timestamp = Date.now()
                },
                rmdir: function (a, b) {
                    var c = x.lookupNode(a, b),
                        e
                    for (e in c.Na) throw new x.ErrnoError(55)
                    delete a.Na[b]
                    a.timestamp = Date.now()
                },
                readdir: function (a) {
                    var b = ['.', '..'],
                        c
                    for (c in a.Na) a.Na.hasOwnProperty(c) && b.push(c)
                    return b
                },
                symlink: function (a, b, c) {
                    a = X.createNode(a, b, 41471, 0)
                    a.link = c
                    return a
                },
                readlink: function (a) {
                    if (!x.fb(a.mode)) throw new x.ErrnoError(28)
                    return a.link
                },
            },
            stream_ops: {
                read: function (a, b, c, e, f) {
                    var g = a.node.Na
                    if (f >= a.node.Ra) return 0
                    a = Math.min(a.node.Ra - f, e)
                    if (8 < a && g.subarray) b.set(g.subarray(f, f + a), c)
                    else for (e = 0; e < a; e++) b[c + e] = g[f + e]
                    return a
                },
                write: function (a, b, c, e, f, g) {
                    b.buffer === D.buffer && (g = !1)
                    if (!e) return 0
                    a = a.node
                    a.timestamp = Date.now()
                    if (b.subarray && (!a.Na || a.Na.subarray)) {
                        if (g) return (a.Na = b.subarray(c, c + e)), (a.Ra = e)
                        if (0 === a.Ra && 0 === f)
                            return (a.Na = b.slice(c, c + e)), (a.Ra = e)
                        if (f + e <= a.Ra)
                            return a.Na.set(b.subarray(c, c + e), f), e
                    }
                    X.ac(a, f + e)
                    if (a.Na.subarray && b.subarray)
                        a.Na.set(b.subarray(c, c + e), f)
                    else for (g = 0; g < e; g++) a.Na[f + g] = b[c + g]
                    a.Ra = Math.max(a.Ra, f + e)
                    return e
                },
                llseek: function (a, b, c) {
                    1 === c
                        ? (b += a.position)
                        : 2 === c && x.isFile(a.node.mode) && (b += a.node.Ra)
                    if (0 > b) throw new x.ErrnoError(28)
                    return b
                },
                allocate: function (a, b, c) {
                    X.ac(a.node, b + c)
                    a.node.Ra = Math.max(a.node.Ra, b + c)
                },
                mmap: function (a, b, c, e, f, g) {
                    if (0 !== b) throw new x.ErrnoError(28)
                    if (!x.isFile(a.node.mode)) throw new x.ErrnoError(43)
                    a = a.node.Na
                    if (g & 2 || a.buffer !== Pa) {
                        if (0 < e || e + c < a.length)
                            a.subarray
                                ? (a = a.subarray(e, e + c))
                                : (a = Array.prototype.slice.call(a, e, e + c))
                        e = !0
                        c = Ab(c)
                        if (!c) throw new x.ErrnoError(48)
                        D.set(a, c)
                    } else (e = !1), (c = a.byteOffset)
                    return { gd: c, vb: e }
                },
                msync: function (a, b, c, e, f) {
                    if (!x.isFile(a.node.mode)) throw new x.ErrnoError(43)
                    if (f & 2) return 0
                    X.stream_ops.write(a, b, 0, e, c, !1)
                    return 0
                },
            },
        }
        function Cb(a, b, c) {
            var e = 'al ' + a
            ta(
                a,
                function (f) {
                    assert(
                        f,
                        'Loading data file "' + a + '" failed (no arrayBuffer).'
                    )
                    b(new Uint8Array(f))
                    e && Za()
                },
                function () {
                    if (c) c()
                    else throw 'Loading data file "' + a + '" failed.'
                }
            )
            e && Ya()
        }
        var x = {
                root: null,
                mb: [],
                Zb: {},
                streams: [],
                $c: 1,
                Ua: null,
                Yb: '/',
                Hb: !1,
                kc: !0,
                Sa: {},
                qc: { nc: { tc: 1, uc: 2 } },
                ErrnoError: null,
                Db: {},
                Mc: null,
                tb: 0,
                lookupPath: function (a, b) {
                    a = tb(x.cwd(), a)
                    b = b || {}
                    if (!a) return { path: '', node: null }
                    var c = { Cb: !0, Pb: 0 },
                        e
                    for (e in c) void 0 === b[e] && (b[e] = c[e])
                    if (8 < b.Pb) throw new x.ErrnoError(32)
                    a = ob(
                        a.split('/').filter(function (k) {
                            return !!k
                        }),
                        !1
                    )
                    var f = x.root
                    c = '/'
                    for (e = 0; e < a.length; e++) {
                        var g = e === a.length - 1
                        if (g && b.parent) break
                        f = x.lookupNode(f, a[e])
                        c = rb(c, a[e])
                        x.ab(f) && (!g || (g && b.Cb)) && (f = f.lb.root)
                        if (!g || b.Ta)
                            for (g = 0; x.fb(f.mode); )
                                if (
                                    ((f = x.readlink(c)),
                                    (c = tb(qb(c), f)),
                                    (f = x.lookupPath(c, { Pb: b.Pb }).node),
                                    40 < g++)
                                )
                                    throw new x.ErrnoError(32)
                    }
                    return { path: c, node: f }
                },
                Ya: function (a) {
                    for (var b; ; ) {
                        if (x.isRoot(a))
                            return (
                                (a = a.mount.mc),
                                b
                                    ? '/' !== a[a.length - 1]
                                        ? a + '/' + b
                                        : a + b
                                    : a
                            )
                        b = b ? a.name + '/' + b : a.name
                        a = a.parent
                    }
                },
                Gb: function (a, b) {
                    for (var c = 0, e = 0; e < b.length; e++)
                        c = ((c << 5) - c + b.charCodeAt(e)) | 0
                    return ((a + c) >>> 0) % x.Ua.length
                },
                ic: function (a) {
                    var b = x.Gb(a.parent.id, a.name)
                    a.cb = x.Ua[b]
                    x.Ua[b] = a
                },
                jc: function (a) {
                    var b = x.Gb(a.parent.id, a.name)
                    if (x.Ua[b] === a) x.Ua[b] = a.cb
                    else
                        for (b = x.Ua[b]; b; ) {
                            if (b.cb === a) {
                                b.cb = a.cb
                                break
                            }
                            b = b.cb
                        }
                },
                lookupNode: function (a, b) {
                    var c = x.Wc(a)
                    if (c) throw new x.ErrnoError(c, a)
                    for (c = x.Ua[x.Gb(a.id, b)]; c; c = c.cb) {
                        var e = c.name
                        if (c.parent.id === a.id && e === b) return c
                    }
                    return x.lookup(a, b)
                },
                createNode: function (a, b, c, e) {
                    a = new x.FSNode(a, b, c, e)
                    x.ic(a)
                    return a
                },
                Ab: function (a) {
                    x.jc(a)
                },
                isRoot: function (a) {
                    return a === a.parent
                },
                ab: function (a) {
                    return !!a.lb
                },
                isFile: function (a) {
                    return 32768 === (a & 61440)
                },
                isDir: function (a) {
                    return 16384 === (a & 61440)
                },
                fb: function (a) {
                    return 40960 === (a & 61440)
                },
                pb: function (a) {
                    return 8192 === (a & 61440)
                },
                Sc: function (a) {
                    return 24576 === (a & 61440)
                },
                isFIFO: function (a) {
                    return 4096 === (a & 61440)
                },
                isSocket: function (a) {
                    return 49152 === (a & 49152)
                },
                Nc: { r: 0, 'r+': 2, w: 577, 'w+': 578, a: 1089, 'a+': 1090 },
                Zc: function (a) {
                    var b = x.Nc[a]
                    if ('undefined' === typeof b)
                        throw Error('Unknown file open mode: ' + a)
                    return b
                },
                bc: function (a) {
                    var b = ['r', 'w', 'rw'][a & 3]
                    a & 512 && (b += 'w')
                    return b
                },
                Za: function (a, b) {
                    if (x.kc) return 0
                    if (!b.includes('r') || a.mode & 292) {
                        if (
                            (b.includes('w') && !(a.mode & 146)) ||
                            (b.includes('x') && !(a.mode & 73))
                        )
                            return 2
                    } else return 2
                    return 0
                },
                Wc: function (a) {
                    var b = x.Za(a, 'x')
                    return b ? b : a.node_ops.lookup ? 0 : 2
                },
                Lb: function (a, b) {
                    try {
                        return x.lookupNode(a, b), 20
                    } catch (c) {}
                    return x.Za(a, 'wx')
                },
                qb: function (a, b, c) {
                    try {
                        var e = x.lookupNode(a, b)
                    } catch (f) {
                        return f.Oa
                    }
                    if ((a = x.Za(a, 'wx'))) return a
                    if (c) {
                        if (!x.isDir(e.mode)) return 54
                        if (x.isRoot(e) || x.Ya(e) === x.cwd()) return 10
                    } else if (x.isDir(e.mode)) return 31
                    return 0
                },
                Xc: function (a, b) {
                    return a
                        ? x.fb(a.mode)
                            ? 32
                            : x.isDir(a.mode) && ('r' !== x.bc(b) || b & 512)
                            ? 31
                            : x.Za(a, x.bc(b))
                        : 44
                },
                rc: 4096,
                ad: function (a, b) {
                    b = b || x.rc
                    for (a = a || 0; a <= b; a++) if (!x.streams[a]) return a
                    throw new x.ErrnoError(33)
                },
                $a: function (a) {
                    return x.streams[a]
                },
                Kc: function (a, b, c) {
                    x.ub ||
                        ((x.ub = function () {}),
                        (x.ub.prototype = {
                            object: {
                                get: function () {
                                    return this.node
                                },
                                set: function (g) {
                                    this.node = g
                                },
                            },
                        }))
                    var e = new x.ub(),
                        f
                    for (f in a) e[f] = a[f]
                    a = e
                    b = x.ad(b, c)
                    a.fd = b
                    return (x.streams[b] = a)
                },
                Ec: function (a) {
                    x.streams[a] = null
                },
                Dc: {
                    open: function (a) {
                        a.stream_ops = x.Qc(a.node.rdev).stream_ops
                        a.stream_ops.open && a.stream_ops.open(a)
                    },
                    llseek: function () {
                        throw new x.ErrnoError(70)
                    },
                },
                Kb: function (a) {
                    return a >> 8
                },
                td: function (a) {
                    return a & 255
                },
                bb: function (a, b) {
                    return (a << 8) | b
                },
                Qb: function (a, b) {
                    x.Zb[a] = { stream_ops: b }
                },
                Qc: function (a) {
                    return x.Zb[a]
                },
                dc: function (a) {
                    var b = []
                    for (a = [a]; a.length; ) {
                        var c = a.pop()
                        b.push(c)
                        a.push.apply(a, c.mb)
                    }
                    return b
                },
                pc: function (a, b) {
                    function c(k) {
                        x.tb--
                        return b(k)
                    }
                    function e(k) {
                        if (k) {
                            if (!e.Lc) return (e.Lc = !0), c(k)
                        } else ++g >= f.length && c(null)
                    }
                    'function' === typeof a && ((b = a), (a = !1))
                    x.tb++
                    1 < x.tb &&
                        N(
                            'warning: ' +
                                x.tb +
                                ' FS.syncfs operations in flight at once, probably just doing extra work'
                        )
                    var f = x.dc(x.root.mount),
                        g = 0
                    f.forEach(function (k) {
                        if (!k.type.pc) return e(null)
                        k.type.pc(k, a, e)
                    })
                },
                mount: function (a, b, c) {
                    var e = '/' === c,
                        f = !c
                    if (e && x.root) throw new x.ErrnoError(10)
                    if (!e && !f) {
                        var g = x.lookupPath(c, { Cb: !1 })
                        c = g.path
                        g = g.node
                        if (x.ab(g)) throw new x.ErrnoError(10)
                        if (!x.isDir(g.mode)) throw new x.ErrnoError(54)
                    }
                    b = { type: a, wd: b, mc: c, mb: [] }
                    a = a.mount(b)
                    a.mount = b
                    b.root = a
                    e
                        ? (x.root = a)
                        : g && ((g.lb = b), g.mount && g.mount.mb.push(b))
                    return a
                },
                zd: function (a) {
                    a = x.lookupPath(a, { Cb: !1 })
                    if (!x.ab(a.node)) throw new x.ErrnoError(28)
                    a = a.node
                    var b = a.lb,
                        c = x.dc(b)
                    Object.keys(x.Ua).forEach(function (e) {
                        for (e = x.Ua[e]; e; ) {
                            var f = e.cb
                            c.includes(e.mount) && x.Ab(e)
                            e = f
                        }
                    })
                    a.lb = null
                    a.mount.mb.splice(a.mount.mb.indexOf(b), 1)
                },
                lookup: function (a, b) {
                    return a.node_ops.lookup(a, b)
                },
                mknod: function (a, b, c) {
                    var e = x.lookupPath(a, { parent: !0 }).node
                    a = W(a)
                    if (!a || '.' === a || '..' === a)
                        throw new x.ErrnoError(28)
                    var f = x.Lb(e, a)
                    if (f) throw new x.ErrnoError(f)
                    if (!e.node_ops.mknod) throw new x.ErrnoError(63)
                    return e.node_ops.mknod(e, a, b, c)
                },
                create: function (a, b) {
                    return x.mknod(
                        a,
                        ((void 0 !== b ? b : 438) & 4095) | 32768,
                        0
                    )
                },
                mkdir: function (a, b) {
                    return x.mknod(
                        a,
                        ((void 0 !== b ? b : 511) & 1023) | 16384,
                        0
                    )
                },
                ud: function (a, b) {
                    a = a.split('/')
                    for (var c = '', e = 0; e < a.length; ++e)
                        if (a[e]) {
                            c += '/' + a[e]
                            try {
                                x.mkdir(c, b)
                            } catch (f) {
                                if (20 != f.Oa) throw f
                            }
                        }
                },
                rb: function (a, b, c) {
                    'undefined' === typeof c && ((c = b), (b = 438))
                    return x.mknod(a, b | 8192, c)
                },
                symlink: function (a, b) {
                    if (!tb(a)) throw new x.ErrnoError(44)
                    var c = x.lookupPath(b, { parent: !0 }).node
                    if (!c) throw new x.ErrnoError(44)
                    b = W(b)
                    var e = x.Lb(c, b)
                    if (e) throw new x.ErrnoError(e)
                    if (!c.node_ops.symlink) throw new x.ErrnoError(63)
                    return c.node_ops.symlink(c, b, a)
                },
                rename: function (a, b) {
                    var c = qb(a),
                        e = qb(b),
                        f = W(a),
                        g = W(b)
                    var k = x.lookupPath(a, { parent: !0 })
                    var l = k.node
                    k = x.lookupPath(b, { parent: !0 })
                    k = k.node
                    if (!l || !k) throw new x.ErrnoError(44)
                    if (l.mount !== k.mount) throw new x.ErrnoError(75)
                    var q = x.lookupNode(l, f)
                    e = ub(a, e)
                    if ('.' !== e.charAt(0)) throw new x.ErrnoError(28)
                    e = ub(b, c)
                    if ('.' !== e.charAt(0)) throw new x.ErrnoError(55)
                    try {
                        var n = x.lookupNode(k, g)
                    } catch (r) {}
                    if (q !== n) {
                        c = x.isDir(q.mode)
                        if ((f = x.qb(l, f, c))) throw new x.ErrnoError(f)
                        if ((f = n ? x.qb(k, g, c) : x.Lb(k, g)))
                            throw new x.ErrnoError(f)
                        if (!l.node_ops.rename) throw new x.ErrnoError(63)
                        if (x.ab(q) || (n && x.ab(n)))
                            throw new x.ErrnoError(10)
                        if (k !== l && (f = x.Za(l, 'w')))
                            throw new x.ErrnoError(f)
                        try {
                            x.Sa.willMovePath && x.Sa.willMovePath(a, b)
                        } catch (r) {
                            N(
                                "FS.trackingDelegate['willMovePath']('" +
                                    a +
                                    "', '" +
                                    b +
                                    "') threw an exception: " +
                                    r.message
                            )
                        }
                        x.jc(q)
                        try {
                            l.node_ops.rename(q, k, g)
                        } catch (r) {
                            throw r
                        } finally {
                            x.ic(q)
                        }
                        try {
                            if (x.Sa.onMovePath) x.Sa.onMovePath(a, b)
                        } catch (r) {
                            N(
                                "FS.trackingDelegate['onMovePath']('" +
                                    a +
                                    "', '" +
                                    b +
                                    "') threw an exception: " +
                                    r.message
                            )
                        }
                    }
                },
                rmdir: function (a) {
                    var b = x.lookupPath(a, { parent: !0 }).node,
                        c = W(a),
                        e = x.lookupNode(b, c),
                        f = x.qb(b, c, !0)
                    if (f) throw new x.ErrnoError(f)
                    if (!b.node_ops.rmdir) throw new x.ErrnoError(63)
                    if (x.ab(e)) throw new x.ErrnoError(10)
                    try {
                        x.Sa.willDeletePath && x.Sa.willDeletePath(a)
                    } catch (g) {
                        N(
                            "FS.trackingDelegate['willDeletePath']('" +
                                a +
                                "') threw an exception: " +
                                g.message
                        )
                    }
                    b.node_ops.rmdir(b, c)
                    x.Ab(e)
                    try {
                        if (x.Sa.onDeletePath) x.Sa.onDeletePath(a)
                    } catch (g) {
                        N(
                            "FS.trackingDelegate['onDeletePath']('" +
                                a +
                                "') threw an exception: " +
                                g.message
                        )
                    }
                },
                readdir: function (a) {
                    a = x.lookupPath(a, { Ta: !0 }).node
                    if (!a.node_ops.readdir) throw new x.ErrnoError(54)
                    return a.node_ops.readdir(a)
                },
                unlink: function (a) {
                    var b = x.lookupPath(a, { parent: !0 }).node,
                        c = W(a),
                        e = x.lookupNode(b, c),
                        f = x.qb(b, c, !1)
                    if (f) throw new x.ErrnoError(f)
                    if (!b.node_ops.unlink) throw new x.ErrnoError(63)
                    if (x.ab(e)) throw new x.ErrnoError(10)
                    try {
                        x.Sa.willDeletePath && x.Sa.willDeletePath(a)
                    } catch (g) {
                        N(
                            "FS.trackingDelegate['willDeletePath']('" +
                                a +
                                "') threw an exception: " +
                                g.message
                        )
                    }
                    b.node_ops.unlink(b, c)
                    x.Ab(e)
                    try {
                        if (x.Sa.onDeletePath) x.Sa.onDeletePath(a)
                    } catch (g) {
                        N(
                            "FS.trackingDelegate['onDeletePath']('" +
                                a +
                                "') threw an exception: " +
                                g.message
                        )
                    }
                },
                readlink: function (a) {
                    a = x.lookupPath(a).node
                    if (!a) throw new x.ErrnoError(44)
                    if (!a.node_ops.readlink) throw new x.ErrnoError(28)
                    return tb(x.Ya(a.parent), a.node_ops.readlink(a))
                },
                stat: function (a, b) {
                    a = x.lookupPath(a, { Ta: !b }).node
                    if (!a) throw new x.ErrnoError(44)
                    if (!a.node_ops.getattr) throw new x.ErrnoError(63)
                    return a.node_ops.getattr(a)
                },
                lstat: function (a) {
                    return x.stat(a, !0)
                },
                chmod: function (a, b, c) {
                    a =
                        'string' === typeof a
                            ? x.lookupPath(a, { Ta: !c }).node
                            : a
                    if (!a.node_ops.setattr) throw new x.ErrnoError(63)
                    a.node_ops.setattr(a, {
                        mode: (b & 4095) | (a.mode & -4096),
                        timestamp: Date.now(),
                    })
                },
                lchmod: function (a, b) {
                    x.chmod(a, b, !0)
                },
                fchmod: function (a, b) {
                    a = x.$a(a)
                    if (!a) throw new x.ErrnoError(8)
                    x.chmod(a.node, b)
                },
                chown: function (a, b, c, e) {
                    a =
                        'string' === typeof a
                            ? x.lookupPath(a, { Ta: !e }).node
                            : a
                    if (!a.node_ops.setattr) throw new x.ErrnoError(63)
                    a.node_ops.setattr(a, { timestamp: Date.now() })
                },
                lchown: function (a, b, c) {
                    x.chown(a, b, c, !0)
                },
                fchown: function (a, b, c) {
                    a = x.$a(a)
                    if (!a) throw new x.ErrnoError(8)
                    x.chown(a.node, b, c)
                },
                truncate: function (a, b) {
                    if (0 > b) throw new x.ErrnoError(28)
                    a =
                        'string' === typeof a
                            ? x.lookupPath(a, { Ta: !0 }).node
                            : a
                    if (!a.node_ops.setattr) throw new x.ErrnoError(63)
                    if (x.isDir(a.mode)) throw new x.ErrnoError(31)
                    if (!x.isFile(a.mode)) throw new x.ErrnoError(28)
                    var c = x.Za(a, 'w')
                    if (c) throw new x.ErrnoError(c)
                    a.node_ops.setattr(a, { size: b, timestamp: Date.now() })
                },
                Oc: function (a, b) {
                    a = x.$a(a)
                    if (!a) throw new x.ErrnoError(8)
                    if (0 === (a.flags & 2097155)) throw new x.ErrnoError(28)
                    x.truncate(a.node, b)
                },
                ld: function (a, b, c) {
                    a = x.lookupPath(a, { Ta: !0 }).node
                    a.node_ops.setattr(a, { timestamp: Math.max(b, c) })
                },
                open: function (a, b, c, e, f) {
                    if ('' === a) throw new x.ErrnoError(44)
                    b = 'string' === typeof b ? x.Zc(b) : b
                    c =
                        b & 64
                            ? (('undefined' === typeof c ? 438 : c) & 4095) |
                              32768
                            : 0
                    if ('object' === typeof a) var g = a
                    else {
                        a = pb(a)
                        try {
                            g = x.lookupPath(a, { Ta: !(b & 131072) }).node
                        } catch (l) {}
                    }
                    var k = !1
                    if (b & 64)
                        if (g) {
                            if (b & 128) throw new x.ErrnoError(20)
                        } else (g = x.mknod(a, c, 0)), (k = !0)
                    if (!g) throw new x.ErrnoError(44)
                    x.pb(g.mode) && (b &= -513)
                    if (b & 65536 && !x.isDir(g.mode))
                        throw new x.ErrnoError(54)
                    if (!k && (c = x.Xc(g, b))) throw new x.ErrnoError(c)
                    b & 512 && x.truncate(g, 0)
                    b &= -131713
                    e = x.Kc(
                        {
                            node: g,
                            path: x.Ya(g),
                            flags: b,
                            seekable: !0,
                            position: 0,
                            stream_ops: g.stream_ops,
                            kd: [],
                            error: !1,
                        },
                        e,
                        f
                    )
                    e.stream_ops.open && e.stream_ops.open(e)
                    !Module.logReadFiles ||
                        b & 1 ||
                        (x.Ob || (x.Ob = {}),
                        a in x.Ob ||
                            ((x.Ob[a] = 1),
                            N('FS.trackingDelegate error on read file: ' + a)))
                    try {
                        x.Sa.onOpenFile &&
                            ((f = 0),
                            1 !== (b & 2097155) && (f |= x.qc.nc.tc),
                            0 !== (b & 2097155) && (f |= x.qc.nc.uc),
                            x.Sa.onOpenFile(a, f))
                    } catch (l) {
                        N(
                            "FS.trackingDelegate['onOpenFile']('" +
                                a +
                                "', flags) threw an exception: " +
                                l.message
                        )
                    }
                    return e
                },
                close: function (a) {
                    if (x.kb(a)) throw new x.ErrnoError(8)
                    a.Fb && (a.Fb = null)
                    try {
                        a.stream_ops.close && a.stream_ops.close(a)
                    } catch (b) {
                        throw b
                    } finally {
                        x.Ec(a.fd)
                    }
                    a.fd = null
                },
                kb: function (a) {
                    return null === a.fd
                },
                llseek: function (a, b, c) {
                    if (x.kb(a)) throw new x.ErrnoError(8)
                    if (!a.seekable || !a.stream_ops.llseek)
                        throw new x.ErrnoError(70)
                    if (0 != c && 1 != c && 2 != c) throw new x.ErrnoError(28)
                    a.position = a.stream_ops.llseek(a, b, c)
                    a.kd = []
                    return a.position
                },
                read: function (a, b, c, e, f) {
                    if (0 > e || 0 > f) throw new x.ErrnoError(28)
                    if (x.kb(a)) throw new x.ErrnoError(8)
                    if (1 === (a.flags & 2097155)) throw new x.ErrnoError(8)
                    if (x.isDir(a.node.mode)) throw new x.ErrnoError(31)
                    if (!a.stream_ops.read) throw new x.ErrnoError(28)
                    var g = 'undefined' !== typeof f
                    if (!g) f = a.position
                    else if (!a.seekable) throw new x.ErrnoError(70)
                    b = a.stream_ops.read(a, b, c, e, f)
                    g || (a.position += b)
                    return b
                },
                write: function (a, b, c, e, f, g) {
                    if (0 > e || 0 > f) throw new x.ErrnoError(28)
                    if (x.kb(a)) throw new x.ErrnoError(8)
                    if (0 === (a.flags & 2097155)) throw new x.ErrnoError(8)
                    if (x.isDir(a.node.mode)) throw new x.ErrnoError(31)
                    if (!a.stream_ops.write) throw new x.ErrnoError(28)
                    a.seekable && a.flags & 1024 && x.llseek(a, 0, 2)
                    var k = 'undefined' !== typeof f
                    if (!k) f = a.position
                    else if (!a.seekable) throw new x.ErrnoError(70)
                    b = a.stream_ops.write(a, b, c, e, f, g)
                    k || (a.position += b)
                    try {
                        if (a.path && x.Sa.onWriteToFile)
                            x.Sa.onWriteToFile(a.path)
                    } catch (l) {
                        N(
                            "FS.trackingDelegate['onWriteToFile']('" +
                                a.path +
                                "') threw an exception: " +
                                l.message
                        )
                    }
                    return b
                },
                allocate: function (a, b, c) {
                    if (x.kb(a)) throw new x.ErrnoError(8)
                    if (0 > b || 0 >= c) throw new x.ErrnoError(28)
                    if (0 === (a.flags & 2097155)) throw new x.ErrnoError(8)
                    if (!x.isFile(a.node.mode) && !x.isDir(a.node.mode))
                        throw new x.ErrnoError(43)
                    if (!a.stream_ops.allocate) throw new x.ErrnoError(138)
                    a.stream_ops.allocate(a, b, c)
                },
                mmap: function (a, b, c, e, f, g) {
                    if (
                        0 !== (f & 2) &&
                        0 === (g & 2) &&
                        2 !== (a.flags & 2097155)
                    )
                        throw new x.ErrnoError(2)
                    if (1 === (a.flags & 2097155)) throw new x.ErrnoError(2)
                    if (!a.stream_ops.mmap) throw new x.ErrnoError(43)
                    return a.stream_ops.mmap(a, b, c, e, f, g)
                },
                msync: function (a, b, c, e, f) {
                    return a && a.stream_ops.msync
                        ? a.stream_ops.msync(a, b, c, e, f)
                        : 0
                },
                vd: function () {
                    return 0
                },
                lc: function (a, b, c) {
                    if (!a.stream_ops.lc) throw new x.ErrnoError(59)
                    return a.stream_ops.lc(a, b, c)
                },
                readFile: function (a, b) {
                    b = b || {}
                    b.flags = b.flags || 0
                    b.encoding = b.encoding || 'binary'
                    if ('utf8' !== b.encoding && 'binary' !== b.encoding)
                        throw Error(
                            'Invalid encoding type "' + b.encoding + '"'
                        )
                    var c,
                        e = x.open(a, b.flags)
                    a = x.stat(a).size
                    var f = new Uint8Array(a)
                    x.read(e, f, 0, a, 0)
                    'utf8' === b.encoding
                        ? (c = Na(f, 0))
                        : 'binary' === b.encoding && (c = f)
                    x.close(e)
                    return c
                },
                writeFile: function (a, b, c) {
                    c = c || {}
                    c.flags = c.flags || 577
                    a = x.open(a, c.flags, c.mode)
                    if ('string' === typeof b) {
                        var e = new Uint8Array(d(b) + 1)
                        b = p(b, e, 0, e.length)
                        x.write(a, e, 0, b, void 0, c.Cc)
                    } else if (ArrayBuffer.isView(b))
                        x.write(a, b, 0, b.byteLength, void 0, c.Cc)
                    else throw Error('Unsupported data type')
                    x.close(a)
                },
                cwd: function () {
                    return x.Yb
                },
                chdir: function (a) {
                    a = x.lookupPath(a, { Ta: !0 })
                    if (null === a.node) throw new x.ErrnoError(44)
                    if (!x.isDir(a.node.mode)) throw new x.ErrnoError(54)
                    var b = x.Za(a.node, 'x')
                    if (b) throw new x.ErrnoError(b)
                    x.Yb = a.path
                },
                Gc: function () {
                    x.mkdir('/tmp')
                    x.mkdir('/home')
                    x.mkdir('/home/web_user')
                },
                Fc: function () {
                    x.mkdir('/dev')
                    x.Qb(x.bb(1, 3), {
                        read: function () {
                            return 0
                        },
                        write: function (b, c, e, f) {
                            return f
                        },
                    })
                    x.rb('/dev/null', x.bb(1, 3))
                    wb(x.bb(5, 0), yb)
                    wb(x.bb(6, 0), zb)
                    x.rb('/dev/tty', x.bb(5, 0))
                    x.rb('/dev/tty1', x.bb(6, 0))
                    var a = sb()
                    x.Wa('/dev', 'random', a)
                    x.Wa('/dev', 'urandom', a)
                    x.mkdir('/dev/shm')
                    x.mkdir('/dev/shm/tmp')
                },
                Ic: function () {
                    x.mkdir('/proc')
                    var a = x.mkdir('/proc/self')
                    x.mkdir('/proc/self/fd')
                    x.mount(
                        {
                            mount: function () {
                                var b = x.createNode(a, 'fd', 16895, 73)
                                b.node_ops = {
                                    lookup: function (c, e) {
                                        var f = x.$a(+e)
                                        if (!f) throw new x.ErrnoError(8)
                                        c = {
                                            parent: null,
                                            mount: { mc: 'fake' },
                                            node_ops: {
                                                readlink: function () {
                                                    return f.path
                                                },
                                            },
                                        }
                                        return (c.parent = c)
                                    },
                                }
                                return b
                            },
                        },
                        {},
                        '/proc/self/fd'
                    )
                },
                Jc: function () {
                    Module.stdin
                        ? x.Wa('/dev', 'stdin', Module.stdin)
                        : x.symlink('/dev/tty', '/dev/stdin')
                    Module.stdout
                        ? x.Wa('/dev', 'stdout', null, Module.stdout)
                        : x.symlink('/dev/tty', '/dev/stdout')
                    Module.stderr
                        ? x.Wa('/dev', 'stderr', null, Module.stderr)
                        : x.symlink('/dev/tty1', '/dev/stderr')
                    x.open('/dev/stdin', 0)
                    x.open('/dev/stdout', 1)
                    x.open('/dev/stderr', 1)
                },
                $b: function () {
                    x.ErrnoError ||
                        ((x.ErrnoError = function (a, b) {
                            this.node = b
                            this.jd = function (c) {
                                this.Oa = c
                            }
                            this.jd(a)
                            this.message = 'FS error'
                        }),
                        (x.ErrnoError.prototype = Error()),
                        (x.ErrnoError.prototype.constructor = x.ErrnoError),
                        [44].forEach(function (a) {
                            x.Db[a] = new x.ErrnoError(a)
                            x.Db[a].stack = '<generic error, no stack>'
                        }))
                },
                oc: function () {
                    x.$b()
                    x.Ua = Array(4096)
                    x.mount(X, {}, '/')
                    x.Gc()
                    x.Fc()
                    x.Ic()
                    x.Mc = { MEMFS: X }
                },
                jb: function (a, b, c) {
                    x.jb.Hb = !0
                    x.$b()
                    Module.stdin = a || Module.stdin
                    Module.stdout = b || Module.stdout
                    Module.stderr = c || Module.stderr
                    x.Jc()
                },
                xd: function () {
                    x.jb.Hb = !1
                    var a = Module._fflush
                    a && a(0)
                    for (a = 0; a < x.streams.length; a++) {
                        var b = x.streams[a]
                        b && x.close(b)
                    }
                },
                Eb: function (a, b) {
                    var c = 0
                    a && (c |= 365)
                    b && (c |= 146)
                    return c
                },
                pd: function (a, b) {
                    a = x.xb(a, b)
                    return a.exists ? a.object : null
                },
                xb: function (a, b) {
                    try {
                        var c = x.lookupPath(a, { Ta: !b })
                        a = c.path
                    } catch (f) {}
                    var e = {
                        isRoot: !1,
                        exists: !1,
                        error: 0,
                        name: null,
                        path: null,
                        object: null,
                        bd: !1,
                        dd: null,
                        cd: null,
                    }
                    try {
                        ;(c = x.lookupPath(a, { parent: !0 })),
                            (e.bd = !0),
                            (e.dd = c.path),
                            (e.cd = c.node),
                            (e.name = W(a)),
                            (c = x.lookupPath(a, { Ta: !b })),
                            (e.exists = !0),
                            (e.path = c.path),
                            (e.object = c.node),
                            (e.name = c.node.name),
                            (e.isRoot = '/' === c.path)
                    } catch (f) {
                        e.error = f.Oa
                    }
                    return e
                },
                nd: function (a, b) {
                    a = 'string' === typeof a ? a : x.Ya(a)
                    for (b = b.split('/').reverse(); b.length; ) {
                        var c = b.pop()
                        if (c) {
                            var e = rb(a, c)
                            try {
                                x.mkdir(e)
                            } catch (f) {}
                            a = e
                        }
                    }
                    return e
                },
                Hc: function (a, b, c, e, f) {
                    a = rb('string' === typeof a ? a : x.Ya(a), b)
                    return x.create(a, x.Eb(e, f))
                },
                zb: function (a, b, c, e, f, g) {
                    a = b ? rb('string' === typeof a ? a : x.Ya(a), b) : a
                    e = x.Eb(e, f)
                    f = x.create(a, e)
                    if (c) {
                        if ('string' === typeof c) {
                            a = Array(c.length)
                            b = 0
                            for (var k = c.length; b < k; ++b)
                                a[b] = c.charCodeAt(b)
                            c = a
                        }
                        x.chmod(f, e | 146)
                        a = x.open(f, 577)
                        x.write(a, c, 0, c.length, 0, g)
                        x.close(a)
                        x.chmod(f, e)
                    }
                    return f
                },
                Wa: function (a, b, c, e) {
                    a = rb('string' === typeof a ? a : x.Ya(a), b)
                    b = x.Eb(!!c, !!e)
                    x.Wa.Kb || (x.Wa.Kb = 64)
                    var f = x.bb(x.Wa.Kb++, 0)
                    x.Qb(f, {
                        open: function (g) {
                            g.seekable = !1
                        },
                        close: function () {
                            e && e.buffer && e.buffer.length && e(10)
                        },
                        read: function (g, k, l, q) {
                            for (var n = 0, r = 0; r < q; r++) {
                                try {
                                    var w = c()
                                } catch (B) {
                                    throw new x.ErrnoError(29)
                                }
                                if (void 0 === w && 0 === n)
                                    throw new x.ErrnoError(6)
                                if (null === w || void 0 === w) break
                                n++
                                k[l + r] = w
                            }
                            n && (g.node.timestamp = Date.now())
                            return n
                        },
                        write: function (g, k, l, q) {
                            for (var n = 0; n < q; n++)
                                try {
                                    e(k[l + n])
                                } catch (r) {
                                    throw new x.ErrnoError(29)
                                }
                            q && (g.node.timestamp = Date.now())
                            return n
                        },
                    })
                    return x.rb(a, b, f)
                },
                cc: function (a) {
                    if (a.Ib || a.Tc || a.link || a.Na) return !0
                    if ('undefined' !== typeof XMLHttpRequest)
                        throw Error(
                            'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
                        )
                    if (sa)
                        try {
                            ;(a.Na = ca(sa(a.url), !0)), (a.Ra = a.Na.length)
                        } catch (b) {
                            throw new x.ErrnoError(29)
                        }
                    else
                        throw Error(
                            'Cannot load without read() or XMLHttpRequest.'
                        )
                },
                md: function (a, b, c, e, f) {
                    function g() {
                        this.Jb = !1
                        this.ob = []
                    }
                    g.prototype.get = function (n) {
                        if (!(n > this.length - 1 || 0 > n)) {
                            var r = n % this.chunkSize
                            return this.hc((n / this.chunkSize) | 0)[r]
                        }
                    }
                    g.prototype.sc = function (n) {
                        this.hc = n
                    }
                    g.prototype.Wb = function () {
                        var n = new XMLHttpRequest()
                        n.open('HEAD', c, !1)
                        n.send(null)
                        if (
                            !(
                                (200 <= n.status && 300 > n.status) ||
                                304 === n.status
                            )
                        )
                            throw Error(
                                "Couldn't load " + c + '. Status: ' + n.status
                            )
                        var r = Number(n.getResponseHeader('Content-length')),
                            w,
                            B =
                                (w = n.getResponseHeader('Accept-Ranges')) &&
                                'bytes' === w
                        n =
                            (w = n.getResponseHeader('Content-Encoding')) &&
                            'gzip' === w
                        var E = 1048576
                        B || (E = r)
                        var A = this
                        A.sc(function (J) {
                            var Z = J * E,
                                U = (J + 1) * E - 1
                            U = Math.min(U, r - 1)
                            if ('undefined' === typeof A.ob[J]) {
                                var Ka = A.ob
                                if (Z > U)
                                    throw Error(
                                        'invalid range (' +
                                            Z +
                                            ', ' +
                                            U +
                                            ') or no bytes requested!'
                                    )
                                if (U > r - 1)
                                    throw Error(
                                        'only ' +
                                            r +
                                            ' bytes available! programmer error!'
                                    )
                                var G = new XMLHttpRequest()
                                G.open('GET', c, !1)
                                r !== E &&
                                    G.setRequestHeader(
                                        'Range',
                                        'bytes=' + Z + '-' + U
                                    )
                                'undefined' != typeof Uint8Array &&
                                    (G.responseType = 'arraybuffer')
                                G.overrideMimeType &&
                                    G.overrideMimeType(
                                        'text/plain; charset=x-user-defined'
                                    )
                                G.send(null)
                                if (
                                    !(
                                        (200 <= G.status && 300 > G.status) ||
                                        304 === G.status
                                    )
                                )
                                    throw Error(
                                        "Couldn't load " +
                                            c +
                                            '. Status: ' +
                                            G.status
                                    )
                                Z =
                                    void 0 !== G.response
                                        ? new Uint8Array(G.response || [])
                                        : ca(G.responseText || '', !0)
                                Ka[J] = Z
                            }
                            if ('undefined' === typeof A.ob[J])
                                throw Error('doXHR failed!')
                            return A.ob[J]
                        })
                        if (n || !r)
                            (E = r = 1),
                                (E = r = this.hc(0).length),
                                xa(
                                    'LazyFiles on gzip forces download of the whole file when length is accessed'
                                )
                        this.wc = r
                        this.vc = E
                        this.Jb = !0
                    }
                    if ('undefined' !== typeof XMLHttpRequest) {
                        if (!pa)
                            throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc'
                        var k = new g()
                        Object.defineProperties(k, {
                            length: {
                                get: function () {
                                    this.Jb || this.Wb()
                                    return this.wc
                                },
                            },
                            chunkSize: {
                                get: function () {
                                    this.Jb || this.Wb()
                                    return this.vc
                                },
                            },
                        })
                        k = { Ib: !1, Na: k }
                    } else k = { Ib: !1, url: c }
                    var l = x.Hc(a, b, k, e, f)
                    k.Na
                        ? (l.Na = k.Na)
                        : k.url && ((l.Na = null), (l.url = k.url))
                    Object.defineProperties(l, {
                        Ra: {
                            get: function () {
                                return this.Na.length
                            },
                        },
                    })
                    var q = {}
                    Object.keys(l.stream_ops).forEach(function (n) {
                        var r = l.stream_ops[n]
                        q[n] = function () {
                            x.cc(l)
                            return r.apply(null, arguments)
                        }
                    })
                    q.read = function (n, r, w, B, E) {
                        x.cc(l)
                        n = n.node.Na
                        if (E >= n.length) return 0
                        B = Math.min(n.length - E, B)
                        if (n.slice)
                            for (var A = 0; A < B; A++) r[w + A] = n[E + A]
                        else for (A = 0; A < B; A++) r[w + A] = n.get(E + A)
                        return B
                    }
                    l.stream_ops = q
                    return l
                },
                od: function (a, b, c, e, f, g, k, l, q, n) {
                    function r(B) {
                        function E(J) {
                            n && n()
                            l || x.zb(a, b, J, e, f, q)
                            g && g()
                            Za()
                        }
                        var A = !1
                        Module.preloadPlugins.forEach(function (J) {
                            !A &&
                                J.canHandle(w) &&
                                (J.handle(B, w, E, function () {
                                    k && k()
                                    Za()
                                }),
                                (A = !0))
                        })
                        A || E(B)
                    }
                    Zb.jb()
                    var w = b ? tb(rb(a, b)) : a
                    Ya()
                    'string' == typeof c
                        ? Cb(
                              c,
                              function (B) {
                                  r(B)
                              },
                              k
                          )
                        : r(c)
                },
                indexedDB: function () {
                    return (
                        window.indexedDB ||
                        window.mozIndexedDB ||
                        window.webkitIndexedDB ||
                        window.msIndexedDB
                    )
                },
                Rb: function () {
                    return 'EM_FS_' + window.location.pathname
                },
                Sb: 20,
                ib: 'FILE_DATA',
                yd: function (a, b, c) {
                    b = b || function () {}
                    c = c || function () {}
                    var e = x.indexedDB()
                    try {
                        var f = e.open(x.Rb(), x.Sb)
                    } catch (g) {
                        return c(g)
                    }
                    f.onupgradeneeded = function () {
                        xa('creating db')
                        f.result.createObjectStore(x.ib)
                    }
                    f.onsuccess = function () {
                        var g = f.result.transaction([x.ib], 'readwrite'),
                            k = g.objectStore(x.ib),
                            l = 0,
                            q = 0,
                            n = a.length
                        a.forEach(function (r) {
                            r = k.put(x.xb(r).object.Na, r)
                            r.onsuccess = function () {
                                l++
                                l + q == n && (0 == q ? b() : c())
                            }
                            r.onerror = function () {
                                q++
                                l + q == n && (0 == q ? b() : c())
                            }
                        })
                        g.onerror = c
                    }
                    f.onerror = c
                },
                sd: function (a, b, c) {
                    b = b || function () {}
                    c = c || function () {}
                    var e = x.indexedDB()
                    try {
                        var f = e.open(x.Rb(), x.Sb)
                    } catch (g) {
                        return c(g)
                    }
                    f.onupgradeneeded = c
                    f.onsuccess = function () {
                        var g = f.result
                        try {
                            var k = g.transaction([x.ib], 'readonly')
                        } catch (w) {
                            c(w)
                            return
                        }
                        var l = k.objectStore(x.ib),
                            q = 0,
                            n = 0,
                            r = a.length
                        a.forEach(function (w) {
                            var B = l.get(w)
                            B.onsuccess = function () {
                                x.xb(w).exists && x.unlink(w)
                                x.zb(qb(w), W(w), B.result, !0, !0, !0)
                                q++
                                q + n == r && (0 == n ? b() : c())
                            }
                            B.onerror = function () {
                                n++
                                q + n == r && (0 == n ? b() : c())
                            }
                        })
                        k.onerror = c
                    }
                    f.onerror = c
                },
            },
            $b = {}
        function ac(a, b, c) {
            try {
                var e = a(b)
            } catch (f) {
                if (f && f.node && pb(b) !== pb(x.Ya(f.node))) return -54
                throw f
            }
            R[c >> 2] = e.dev
            R[(c + 4) >> 2] = 0
            R[(c + 8) >> 2] = e.ino
            R[(c + 12) >> 2] = e.mode
            R[(c + 16) >> 2] = e.nlink
            R[(c + 20) >> 2] = e.uid
            R[(c + 24) >> 2] = e.gid
            R[(c + 28) >> 2] = e.rdev
            R[(c + 32) >> 2] = 0
            S = [
                e.size >>> 0,
                ((T = e.size),
                1 <= +Math.abs(T)
                    ? 0 < T
                        ? (Math.min(+Math.floor(T / 4294967296), 4294967295) |
                              0) >>>
                          0
                        : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0
                    : 0),
            ]
            R[(c + 40) >> 2] = S[0]
            R[(c + 44) >> 2] = S[1]
            R[(c + 48) >> 2] = 4096
            R[(c + 52) >> 2] = e.blocks
            R[(c + 56) >> 2] = (e.atime.getTime() / 1e3) | 0
            R[(c + 60) >> 2] = 0
            R[(c + 64) >> 2] = (e.mtime.getTime() / 1e3) | 0
            R[(c + 68) >> 2] = 0
            R[(c + 72) >> 2] = (e.ctime.getTime() / 1e3) | 0
            R[(c + 76) >> 2] = 0
            S = [
                e.ino >>> 0,
                ((T = e.ino),
                1 <= +Math.abs(T)
                    ? 0 < T
                        ? (Math.min(+Math.floor(T / 4294967296), 4294967295) |
                              0) >>>
                          0
                        : ~~+Math.ceil((T - +(~~T >>> 0)) / 4294967296) >>> 0
                    : 0),
            ]
            R[(c + 80) >> 2] = S[0]
            R[(c + 84) >> 2] = S[1]
            return 0
        }
        var bc = void 0
        function cc() {
            bc += 4
            return R[(bc - 4) >> 2]
        }
        function Y(a) {
            a = x.$a(a)
            if (!a) throw new x.ErrnoError(8)
            return a
        }
        var dc
        dc = qa
            ? function () {
                  var a = process.hrtime()
                  return 1e3 * a[0] + a[1] / 1e6
              }
            : function () {
                  return performance.now()
              }
        var ec = {}
        function fc() {
            if (!gc) {
                var a = {
                        USER: 'web_user',
                        LOGNAME: 'web_user',
                        PATH: '/',
                        PWD: '/',
                        HOME: '/home/web_user',
                        LANG:
                            (
                                ('object' === typeof navigator &&
                                    navigator.languages &&
                                    navigator.languages[0]) ||
                                'C'
                            ).replace('-', '_') + '.UTF-8',
                        _: na || './this.program',
                    },
                    b
                for (b in ec) void 0 === ec[b] ? delete a[b] : (a[b] = ec[b])
                var c = []
                for (b in a) c.push(b + '=' + a[b])
                gc = c
            }
            return gc
        }
        var gc
        function hc(a, b, c, e) {
            a || (a = this)
            this.parent = a
            this.mount = a.mount
            this.lb = null
            this.id = x.$c++
            this.name = b
            this.mode = c
            this.node_ops = {}
            this.stream_ops = {}
            this.rdev = e
        }
        Object.defineProperties(hc.prototype, {
            read: {
                get: function () {
                    return 365 === (this.mode & 365)
                },
                set: function (a) {
                    a ? (this.mode |= 365) : (this.mode &= -366)
                },
            },
            write: {
                get: function () {
                    return 146 === (this.mode & 146)
                },
                set: function (a) {
                    a ? (this.mode |= 146) : (this.mode &= -147)
                },
            },
            Tc: {
                get: function () {
                    return x.isDir(this.mode)
                },
            },
            Ib: {
                get: function () {
                    return x.pb(this.mode)
                },
            },
        })
        x.FSNode = hc
        x.oc()
        var Zb
        function ca(a, b) {
            var c = Array(d(a) + 1)
            a = p(a, c, 0, c.length)
            b && (c.length = a)
            return c
        }
        var jc = {
            a: function (a, b, c, e) {
                Q(
                    'Assertion failed: ' +
                        F(a) +
                        ', at: ' +
                        [
                            b ? F(b) : 'unknown filename',
                            c,
                            e ? F(e) : 'unknown function',
                        ]
                )
            },
            r: function (a, b) {
                nb || ((nb = !0), jb())
                a = new Date(1e3 * R[a >> 2])
                R[b >> 2] = a.getSeconds()
                R[(b + 4) >> 2] = a.getMinutes()
                R[(b + 8) >> 2] = a.getHours()
                R[(b + 12) >> 2] = a.getDate()
                R[(b + 16) >> 2] = a.getMonth()
                R[(b + 20) >> 2] = a.getFullYear() - 1900
                R[(b + 24) >> 2] = a.getDay()
                var c = new Date(a.getFullYear(), 0, 1)
                R[(b + 28) >> 2] = ((a.getTime() - c.getTime()) / 864e5) | 0
                R[(b + 36) >> 2] = -(60 * a.getTimezoneOffset())
                var e = new Date(a.getFullYear(), 6, 1).getTimezoneOffset()
                c = c.getTimezoneOffset()
                a = (e != c && a.getTimezoneOffset() == Math.min(c, e)) | 0
                R[(b + 32) >> 2] = a
                a = R[(mb() + (a ? 4 : 0)) >> 2]
                R[(b + 40) >> 2] = a
                return b
            },
            C: function (a, b) {
                try {
                    a = F(a)
                    if (b & -8) var c = -28
                    else {
                        var e
                        ;(e = x.lookupPath(a, { Ta: !0 }).node)
                            ? ((a = ''),
                              b & 4 && (a += 'r'),
                              b & 2 && (a += 'w'),
                              b & 1 && (a += 'x'),
                              (c = a && x.Za(e, a) ? -2 : 0))
                            : (c = -44)
                    }
                    return c
                } catch (f) {
                    return (
                        ('undefined' !== typeof x &&
                            f instanceof x.ErrnoError) ||
                            Q(f),
                        -f.Oa
                    )
                }
            },
            x: function (a, b) {
                try {
                    return (a = F(a)), x.chmod(a, b), 0
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        -c.Oa
                    )
                }
            },
            J: function (a, b, c) {
                try {
                    return (a = F(a)), x.chown(a, b, c), 0
                } catch (e) {
                    return (
                        ('undefined' !== typeof x &&
                            e instanceof x.ErrnoError) ||
                            Q(e),
                        -e.Oa
                    )
                }
            },
            y: function (a, b) {
                try {
                    return x.fchmod(a, b), 0
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        -c.Oa
                    )
                }
            },
            h: function (a, b, c) {
                try {
                    return x.fchown(a, b, c), 0
                } catch (e) {
                    return (
                        ('undefined' !== typeof x &&
                            e instanceof x.ErrnoError) ||
                            Q(e),
                        -e.Oa
                    )
                }
            },
            b: function (a, b, c) {
                bc = c
                try {
                    var e = Y(a)
                    switch (b) {
                        case 0:
                            var f = cc()
                            return 0 > f
                                ? -28
                                : x.open(e.path, e.flags, 0, f).fd
                        case 1:
                        case 2:
                            return 0
                        case 3:
                            return e.flags
                        case 4:
                            return (f = cc()), (e.flags |= f), 0
                        case 12:
                            return (f = cc()), (Ca[(f + 0) >> 1] = 2), 0
                        case 13:
                        case 14:
                            return 0
                        case 16:
                        case 8:
                            return -28
                        case 9:
                            return (R[ic() >> 2] = 28), -1
                        default:
                            return -28
                    }
                } catch (g) {
                    return (
                        ('undefined' !== typeof x &&
                            g instanceof x.ErrnoError) ||
                            Q(g),
                        -g.Oa
                    )
                }
            },
            w: function (a, b) {
                try {
                    var c = Y(a)
                    return ac(x.stat, c.path, b)
                } catch (e) {
                    return (
                        ('undefined' !== typeof x &&
                            e instanceof x.ErrnoError) ||
                            Q(e),
                        -e.Oa
                    )
                }
            },
            i: function (a, b, c) {
                try {
                    return x.Oc(a, c), 0
                } catch (e) {
                    return (
                        ('undefined' !== typeof x &&
                            e instanceof x.ErrnoError) ||
                            Q(e),
                        -e.Oa
                    )
                }
            },
            I: function (a, b) {
                try {
                    if (0 === b) return -28
                    var c = x.cwd()
                    if (b < d(c) + 1) return -68
                    p(c, t, a, b)
                    return a
                } catch (e) {
                    return (
                        ('undefined' !== typeof x &&
                            e instanceof x.ErrnoError) ||
                            Q(e),
                        -e.Oa
                    )
                }
            },
            D: function () {
                return 0
            },
            d: function () {
                return 42
            },
            v: function (a, b) {
                try {
                    return (a = F(a)), ac(x.lstat, a, b)
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        -c.Oa
                    )
                }
            },
            u: function (a, b) {
                try {
                    return (
                        (a = F(a)),
                        (a = pb(a)),
                        '/' === a[a.length - 1] &&
                            (a = a.substr(0, a.length - 1)),
                        x.mkdir(a, b, 0),
                        0
                    )
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        -c.Oa
                    )
                }
            },
            t: function (a, b, c, e, f, g) {
                try {
                    a: {
                        g <<= 12
                        var k = !1
                        if (0 !== (e & 16) && 0 !== a % 65536) var l = -28
                        else {
                            if (0 !== (e & 32)) {
                                var q = Ab(b)
                                if (!q) {
                                    l = -48
                                    break a
                                }
                                k = !0
                            } else {
                                var n = x.$a(f)
                                if (!n) {
                                    l = -8
                                    break a
                                }
                                var r = x.mmap(n, a, b, g, c, e)
                                q = r.gd
                                k = r.vb
                            }
                            $b[q] = {
                                Vc: q,
                                Uc: b,
                                vb: k,
                                fd: f,
                                ed: c,
                                flags: e,
                                offset: g,
                            }
                            l = q
                        }
                    }
                    return l
                } catch (w) {
                    return (
                        ('undefined' !== typeof x &&
                            w instanceof x.ErrnoError) ||
                            Q(w),
                        -w.Oa
                    )
                }
            },
            s: function (a, b) {
                try {
                    var c = $b[a]
                    if (0 !== b && c) {
                        if (b === c.Uc) {
                            var e = x.$a(c.fd)
                            if (e && c.ed & 2) {
                                var f = c.flags,
                                    g = c.offset,
                                    k = t.slice(a, a + b)
                                x.msync(e, k, g, b, f)
                            }
                            $b[a] = null
                            c.vb && ea(c.Vc)
                        }
                        var l = 0
                    } else l = -28
                    return l
                } catch (q) {
                    return (
                        ('undefined' !== typeof x &&
                            q instanceof x.ErrnoError) ||
                            Q(q),
                        -q.Oa
                    )
                }
            },
            k: function (a, b, c) {
                bc = c
                try {
                    var e = F(a),
                        f = c ? cc() : 0
                    return x.open(e, b, f).fd
                } catch (g) {
                    return (
                        ('undefined' !== typeof x &&
                            g instanceof x.ErrnoError) ||
                            Q(g),
                        -g.Oa
                    )
                }
            },
            B: function (a, b, c) {
                try {
                    a = F(a)
                    if (0 >= c) var e = -28
                    else {
                        var f = x.readlink(a),
                            g = Math.min(c, d(f)),
                            k = D[b + g]
                        p(f, t, b, c + 1)
                        D[b + g] = k
                        e = g
                    }
                    return e
                } catch (l) {
                    return (
                        ('undefined' !== typeof x &&
                            l instanceof x.ErrnoError) ||
                            Q(l),
                        -l.Oa
                    )
                }
            },
            H: function (a) {
                try {
                    return (a = F(a)), x.rmdir(a), 0
                } catch (b) {
                    return (
                        ('undefined' !== typeof x &&
                            b instanceof x.ErrnoError) ||
                            Q(b),
                        -b.Oa
                    )
                }
            },
            f: function (a, b) {
                try {
                    return (a = F(a)), ac(x.stat, a, b)
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        -c.Oa
                    )
                }
            },
            F: function (a) {
                try {
                    return (a = F(a)), x.unlink(a), 0
                } catch (b) {
                    return (
                        ('undefined' !== typeof x &&
                            b instanceof x.ErrnoError) ||
                            Q(b),
                        -b.Oa
                    )
                }
            },
            j: function () {
                return 2147483648
            },
            m: function (a, b, c) {
                t.copyWithin(a, b, b + c)
            },
            c: function (a) {
                var b = t.length
                a >>>= 0
                if (2147483648 < a) return !1
                for (var c = 1; 4 >= c; c *= 2) {
                    var e = b * (1 + 0.2 / c)
                    e = Math.min(e, a + 100663296)
                    e = Math.max(a, e)
                    0 < e % 65536 && (e += 65536 - (e % 65536))
                    a: {
                        try {
                            Fa.grow(
                                (Math.min(2147483648, e) -
                                    Pa.byteLength +
                                    65535) >>>
                                    16
                            )
                            Qa()
                            var f = 1
                            break a
                        } catch (g) {}
                        f = void 0
                    }
                    if (f) return !0
                }
                return !1
            },
            q: function (a) {
                for (var b = dc(); dc() - b < a; );
            },
            o: function (a, b) {
                var c = 0
                fc().forEach(function (e, f) {
                    var g = b + c
                    f = R[(a + 4 * f) >> 2] = g
                    for (g = 0; g < e.length; ++g) D[f++ >> 0] = e.charCodeAt(g)
                    D[f >> 0] = 0
                    c += e.length + 1
                })
                return 0
            },
            p: function (a, b) {
                var c = fc()
                R[a >> 2] = c.length
                var e = 0
                c.forEach(function (f) {
                    e += f.length + 1
                })
                R[b >> 2] = e
                return 0
            },
            e: function (a) {
                try {
                    var b = Y(a)
                    x.close(b)
                    return 0
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        c.Oa
                    )
                }
            },
            n: function (a, b) {
                try {
                    var c = Y(a),
                        e = c.tty
                            ? 2
                            : x.isDir(c.mode)
                            ? 3
                            : x.fb(c.mode)
                            ? 7
                            : 4
                    D[b >> 0] = e
                    return 0
                } catch (f) {
                    return (
                        ('undefined' !== typeof x &&
                            f instanceof x.ErrnoError) ||
                            Q(f),
                        f.Oa
                    )
                }
            },
            G: function (a, b, c, e) {
                try {
                    a: {
                        for (var f = Y(a), g = (a = 0); g < c; g++) {
                            var k = R[(b + (8 * g + 4)) >> 2],
                                l = x.read(f, D, R[(b + 8 * g) >> 2], k, void 0)
                            if (0 > l) {
                                var q = -1
                                break a
                            }
                            a += l
                            if (l < k) break
                        }
                        q = a
                    }
                    R[e >> 2] = q
                    return 0
                } catch (n) {
                    return (
                        ('undefined' !== typeof x &&
                            n instanceof x.ErrnoError) ||
                            Q(n),
                        n.Oa
                    )
                }
            },
            l: function (a, b, c, e, f) {
                try {
                    var g = Y(a)
                    a = 4294967296 * c + (b >>> 0)
                    if (-9007199254740992 >= a || 9007199254740992 <= a)
                        return -61
                    x.llseek(g, a, e)
                    S = [
                        g.position >>> 0,
                        ((T = g.position),
                        1 <= +Math.abs(T)
                            ? 0 < T
                                ? (Math.min(
                                      +Math.floor(T / 4294967296),
                                      4294967295
                                  ) |
                                      0) >>>
                                  0
                                : ~~+Math.ceil(
                                      (T - +(~~T >>> 0)) / 4294967296
                                  ) >>> 0
                            : 0),
                    ]
                    R[f >> 2] = S[0]
                    R[(f + 4) >> 2] = S[1]
                    g.Fb && 0 === a && 0 === e && (g.Fb = null)
                    return 0
                } catch (k) {
                    return (
                        ('undefined' !== typeof x &&
                            k instanceof x.ErrnoError) ||
                            Q(k),
                        k.Oa
                    )
                }
            },
            E: function (a) {
                try {
                    var b = Y(a)
                    return b.stream_ops && b.stream_ops.fsync
                        ? -b.stream_ops.fsync(b)
                        : 0
                } catch (c) {
                    return (
                        ('undefined' !== typeof x &&
                            c instanceof x.ErrnoError) ||
                            Q(c),
                        c.Oa
                    )
                }
            },
            z: function (a, b, c, e) {
                try {
                    a: {
                        for (var f = Y(a), g = (a = 0); g < c; g++) {
                            var k = x.write(
                                f,
                                D,
                                R[(b + 8 * g) >> 2],
                                R[(b + (8 * g + 4)) >> 2],
                                void 0
                            )
                            if (0 > k) {
                                var l = -1
                                break a
                            }
                            a += k
                        }
                        l = a
                    }
                    R[e >> 2] = l
                    return 0
                } catch (q) {
                    return (
                        ('undefined' !== typeof x &&
                            q instanceof x.ErrnoError) ||
                            Q(q),
                        q.Oa
                    )
                }
            },
            g: function (a) {
                var b = Date.now()
                R[a >> 2] = (b / 1e3) | 0
                R[(a + 4) >> 2] = ((b % 1e3) * 1e3) | 0
                return 0
            },
            K: function (a) {
                var b = (Date.now() / 1e3) | 0
                a && (R[a >> 2] = b)
                return b
            },
            A: function (a, b) {
                if (b) {
                    var c = b + 8
                    b = 1e3 * R[c >> 2]
                    b += R[(c + 4) >> 2] / 1e3
                } else b = Date.now()
                a = F(a)
                try {
                    x.ld(a, b, b)
                    var e = 0
                } catch (f) {
                    if (!(f instanceof x.ErrnoError)) {
                        b: {
                            e = Error()
                            if (!e.stack) {
                                try {
                                    throw Error()
                                } catch (g) {
                                    e = g
                                }
                                if (!e.stack) {
                                    e = '(no stack trace available)'
                                    break b
                                }
                            }
                            e = e.stack.toString()
                        }
                        Module.extraStackTrace &&
                            (e += '\n' + Module.extraStackTrace())
                        e = ib(e)
                        throw f + ' : ' + e
                    }
                    e = f.Oa
                    R[ic() >> 2] = e
                    e = -1
                }
                return e
            },
        }
        ;(function () {
            function a(f) {
                Module.asm = f.exports
                Fa = Module.asm.L
                Qa()
                P = Module.asm.Da
                Sa.unshift(Module.asm.M)
                Za()
            }
            function b(f) {
                a(f.instance)
            }
            function c(f) {
                return cb()
                    .then(function (g) {
                        return WebAssembly.instantiate(g, e)
                    })
                    .then(function (g) {
                        return g
                    })
                    .then(f, function (g) {
                        N('failed to asynchronously prepare wasm: ' + g)
                        Q(g)
                    })
            }
            var e = { a: jc }
            Ya()
            if (Module.instantiateWasm)
                try {
                    return Module.instantiateWasm(e, a)
                } catch (f) {
                    return (
                        N(
                            'Module.instantiateWasm callback failed with error: ' +
                                f
                        ),
                        !1
                    )
                }
            ;(function () {
                return Ba ||
                    'function' !== typeof WebAssembly.instantiateStreaming ||
                    $a() ||
                    V.startsWith('file://') ||
                    'function' !== typeof fetch
                    ? c(b)
                    : fetch(V, { credentials: 'same-origin' }).then(function (
                          f
                      ) {
                          return WebAssembly.instantiateStreaming(f, e).then(
                              b,
                              function (g) {
                                  N('wasm streaming compile failed: ' + g)
                                  N('falling back to ArrayBuffer instantiation')
                                  return c(b)
                              }
                          )
                      })
            })()
            return {}
        })()
        Module.___wasm_call_ctors = function () {
            return (Module.___wasm_call_ctors = Module.asm.M).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_vfs_find = function () {
            return (Module._sqlite3_vfs_find = Module.asm.N).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_free = function () {
            return (Module._sqlite3_free = Module.asm.O).apply(null, arguments)
        }
        var ic = (Module.___errno_location = function () {
            return (ic = Module.___errno_location = Module.asm.P).apply(
                null,
                arguments
            )
        })
        Module._sqlite3_step = function () {
            return (Module._sqlite3_step = Module.asm.Q).apply(null, arguments)
        }
        Module._sqlite3_finalize = function () {
            return (Module._sqlite3_finalize = Module.asm.R).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_prepare_v2 = function () {
            return (Module._sqlite3_prepare_v2 = Module.asm.S).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_reset = function () {
            return (Module._sqlite3_reset = Module.asm.T).apply(null, arguments)
        }
        Module._sqlite3_clear_bindings = function () {
            return (Module._sqlite3_clear_bindings = Module.asm.U).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_blob = function () {
            return (Module._sqlite3_value_blob = Module.asm.V).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_text = function () {
            return (Module._sqlite3_value_text = Module.asm.W).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_bytes = function () {
            return (Module._sqlite3_value_bytes = Module.asm.X).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_double = function () {
            return (Module._sqlite3_value_double = Module.asm.Y).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_int = function () {
            return (Module._sqlite3_value_int = Module.asm.Z).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_value_type = function () {
            return (Module._sqlite3_value_type = Module.asm._).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_blob = function () {
            return (Module._sqlite3_result_blob = Module.asm.$).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_double = function () {
            return (Module._sqlite3_result_double = Module.asm.aa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_error = function () {
            return (Module._sqlite3_result_error = Module.asm.ba).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_int = function () {
            return (Module._sqlite3_result_int = Module.asm.ca).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_int64 = function () {
            return (Module._sqlite3_result_int64 = Module.asm.da).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_null = function () {
            return (Module._sqlite3_result_null = Module.asm.ea).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_result_text = function () {
            return (Module._sqlite3_result_text = Module.asm.fa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_count = function () {
            return (Module._sqlite3_column_count = Module.asm.ga).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_data_count = function () {
            return (Module._sqlite3_data_count = Module.asm.ha).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_blob = function () {
            return (Module._sqlite3_column_blob = Module.asm.ia).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_bytes = function () {
            return (Module._sqlite3_column_bytes = Module.asm.ja).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_double = function () {
            return (Module._sqlite3_column_double = Module.asm.ka).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_text = function () {
            return (Module._sqlite3_column_text = Module.asm.la).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_type = function () {
            return (Module._sqlite3_column_type = Module.asm.ma).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_column_name = function () {
            return (Module._sqlite3_column_name = Module.asm.na).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_bind_blob = function () {
            return (Module._sqlite3_bind_blob = Module.asm.oa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_bind_double = function () {
            return (Module._sqlite3_bind_double = Module.asm.pa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_bind_int = function () {
            return (Module._sqlite3_bind_int = Module.asm.qa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_bind_text = function () {
            return (Module._sqlite3_bind_text = Module.asm.ra).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_bind_parameter_index = function () {
            return (Module._sqlite3_bind_parameter_index = Module.asm.sa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_sql = function () {
            return (Module._sqlite3_sql = Module.asm.ta).apply(null, arguments)
        }
        Module._sqlite3_normalized_sql = function () {
            return (Module._sqlite3_normalized_sql = Module.asm.ua).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_errmsg = function () {
            return (Module._sqlite3_errmsg = Module.asm.va).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_exec = function () {
            return (Module._sqlite3_exec = Module.asm.wa).apply(null, arguments)
        }
        Module._sqlite3_changes = function () {
            return (Module._sqlite3_changes = Module.asm.xa).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_close_v2 = function () {
            return (Module._sqlite3_close_v2 = Module.asm.ya).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_create_function_v2 = function () {
            return (Module._sqlite3_create_function_v2 = Module.asm.za).apply(
                null,
                arguments
            )
        }
        Module._sqlite3_open = function () {
            return (Module._sqlite3_open = Module.asm.Aa).apply(null, arguments)
        }
        var ba = (Module._malloc = function () {
                return (ba = Module._malloc = Module.asm.Ba).apply(
                    null,
                    arguments
                )
            }),
            ea = (Module._free = function () {
                return (ea = Module._free = Module.asm.Ca).apply(
                    null,
                    arguments
                )
            })
        Module._RegisterExtensionFunctions = function () {
            return (Module._RegisterExtensionFunctions = Module.asm.Ea).apply(
                null,
                arguments
            )
        }
        Module._register_for_idb = function () {
            return (Module._register_for_idb = Module.asm.Fa).apply(
                null,
                arguments
            )
        }
        var mb = (Module.__get_tzname = function () {
                return (mb = Module.__get_tzname = Module.asm.Ga).apply(
                    null,
                    arguments
                )
            }),
            lb = (Module.__get_daylight = function () {
                return (lb = Module.__get_daylight = Module.asm.Ha).apply(
                    null,
                    arguments
                )
            }),
            kb = (Module.__get_timezone = function () {
                return (kb = Module.__get_timezone = Module.asm.Ia).apply(
                    null,
                    arguments
                )
            }),
            ha = (Module.stackSave = function () {
                return (ha = Module.stackSave = Module.asm.Ja).apply(
                    null,
                    arguments
                )
            }),
            ja = (Module.stackRestore = function () {
                return (ja = Module.stackRestore = Module.asm.Ka).apply(
                    null,
                    arguments
                )
            }),
            C = (Module.stackAlloc = function () {
                return (C = Module.stackAlloc = Module.asm.La).apply(
                    null,
                    arguments
                )
            }),
            Bb = (Module._memalign = function () {
                return (Bb = Module._memalign = Module.asm.Ma).apply(
                    null,
                    arguments
                )
            })
        Module.cwrap = function (a, b, c, e) {
            c = c || []
            var f = c.every(function (g) {
                return 'number' === g
            })
            return 'string' !== b && f && !e
                ? Ha(a)
                : function () {
                      return Ia(a, b, c, arguments)
                  }
        }
        Module.UTF8ToString = F
        Module.FS = x
        Module.stackSave = ha
        Module.stackRestore = ja
        Module.stackAlloc = C
        var kc
        Xa = function lc() {
            kc || mc()
            kc || (Xa = lc)
        }
        function mc() {
            function a() {
                if (!kc && ((kc = !0), (Module.calledRun = !0), !Ga)) {
                    Module.noFSInit || x.jb.Hb || x.jb()
                    x.kc = !1
                    hb(Sa)
                    if (Module.onRuntimeInitialized)
                        Module.onRuntimeInitialized()
                    if (Module.postRun)
                        for (
                            'function' == typeof Module.postRun &&
                            (Module.postRun = [Module.postRun]);
                            Module.postRun.length;

                        ) {
                            var b = Module.postRun.shift()
                            Ta.unshift(b)
                        }
                    hb(Ta)
                }
            }
            if (!(0 < Va)) {
                if (Module.preRun)
                    for (
                        'function' == typeof Module.preRun &&
                        (Module.preRun = [Module.preRun]);
                        Module.preRun.length;

                    )
                        Ua()
                hb(Ra)
                0 < Va ||
                    (Module.setStatus
                        ? (Module.setStatus('Running...'),
                          setTimeout(function () {
                              setTimeout(function () {
                                  Module.setStatus('')
                              }, 1)
                              a()
                          }, 1))
                        : a())
            }
        }
        Module.run = mc
        if (Module.preInit)
            for (
                'function' == typeof Module.preInit &&
                (Module.preInit = [Module.preInit]);
                0 < Module.preInit.length;

            )
                Module.preInit.pop()()
        mc()

        // The shell-pre.js and emcc-generated code goes above
        return Module
    }) // The end of the promise being returned

    return initSqlJsPromise
} // The end of our initSqlJs function

// This bit below is copied almost exactly from what you get when you use the MODULARIZE=1 flag with emcc
// However, we don't want to use the emcc modularization. See shell-pre.js
if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = initSqlJs
    // This will allow the module to be used in ES6 or CommonJS
    module.exports.default = initSqlJs
} else if (typeof define === 'function' && define['amd']) {
    define([], function () {
        return initSqlJs
    })
} else if (typeof exports === 'object') {
    exports['Module'] = initSqlJs
}
/* global initSqlJs */
/* eslint-env worker */
/* eslint no-restricted-globals: ["error"] */

;('use strict')

var db

function onModuleReady(SQL) {
    function createDb(data) {
        if (db != null) db.close()
        db = new SQL.Database(data)
        return db
    }

    var buff
    var data
    var result
    data = this['data']
    var config = data['config'] ? data['config'] : {}
    switch (data && data['action']) {
        case 'open':
            buff = data['buffer']
            createDb(buff && new Uint8Array(buff))
            return postMessage({
                id: data['id'],
                ready: true,
            })
        case 'exec':
            if (db === null) {
                createDb()
            }
            if (!data['sql']) {
                throw 'exec: Missing query string'
            }
            return postMessage({
                id: data['id'],
                results: db.exec(data['sql'], data['params'], config),
            })
        case 'each':
            if (db === null) {
                createDb()
            }
            var callback = function callback(row) {
                return postMessage({
                    id: data['id'],
                    row: row,
                    finished: false,
                })
            }
            var done = function done() {
                return postMessage({
                    id: data['id'],
                    finished: true,
                })
            }
            return db.each(data['sql'], data['params'], callback, done, config)
        case 'export':
            buff = db['export']()
            result = {
                id: data['id'],
                buffer: buff,
            }
            try {
                return postMessage(result, [result])
            } catch (error) {
                return postMessage(result)
            }
        case 'close':
            if (db) {
                db.close()
            }
            return postMessage({
                id: data['id'],
            })
        default:
            throw new Error('Invalid action : ' + (data && data['action']))
    }
}

function onError(err) {
    return postMessage({
        id: this['data']['id'],
        error: err['message'],
    })
}

if (typeof importScripts === 'function') {
    db = null
    var sqlModuleReady = initSqlJs()
    self.onmessage = function onmessage(event) {
        return sqlModuleReady
            .then(onModuleReady.bind(event))
            .catch(onError.bind(event))
    }
}
