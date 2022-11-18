
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.47.0 */

    const { Error: Error_1, Object: Object_1, console: console_1$s } = globals;

    // (251:0) {:else}
    function create_else_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$C(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$C.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$C($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$s.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$C, create_fragment$C, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$C.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\Home.svelte generated by Svelte v3.47.0 */

    const file$B = "src\\front\\Home.svelte";

    function create_fragment$B(ctx) {
    	let main;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div96;
    	let h10;
    	let t2;
    	let div5;
    	let div0;
    	let t3;
    	let div3;
    	let div2;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let div1;
    	let h40;
    	let b0;
    	let t6;
    	let a0;
    	let button0;
    	let t8;
    	let div4;
    	let t9;
    	let h11;
    	let t11;
    	let hr;
    	let t12;
    	let div15;
    	let div8;
    	let div7;
    	let img2;
    	let img2_src_value;
    	let t13;
    	let div6;
    	let h41;
    	let b1;
    	let t15;
    	let a1;
    	let button1;
    	let t17;
    	let br0;
    	let t18;
    	let a2;
    	let button2;
    	let t20;
    	let br1;
    	let t21;
    	let a3;
    	let button3;
    	let t23;
    	let div11;
    	let div10;
    	let img3;
    	let img3_src_value;
    	let t24;
    	let div9;
    	let h42;
    	let b2;
    	let t26;
    	let a4;
    	let button4;
    	let t28;
    	let div14;
    	let div13;
    	let img4;
    	let img4_src_value;
    	let t29;
    	let div12;
    	let h43;
    	let b3;
    	let t31;
    	let a5;
    	let button5;
    	let t33;
    	let br2;
    	let t34;
    	let div25;
    	let div18;
    	let div17;
    	let img5;
    	let img5_src_value;
    	let t35;
    	let div16;
    	let h44;
    	let b4;
    	let t37;
    	let a6;
    	let button6;
    	let t39;
    	let div21;
    	let div20;
    	let img6;
    	let img6_src_value;
    	let t40;
    	let div19;
    	let h45;
    	let b5;
    	let t42;
    	let a7;
    	let button7;
    	let t44;
    	let br3;
    	let t45;
    	let a8;
    	let button8;
    	let t47;
    	let br4;
    	let t48;
    	let a9;
    	let button9;
    	let t50;
    	let div24;
    	let div23;
    	let img7;
    	let img7_src_value;
    	let t51;
    	let div22;
    	let h46;
    	let b6;
    	let t53;
    	let a10;
    	let button10;
    	let t55;
    	let br5;
    	let t56;
    	let div35;
    	let div28;
    	let div27;
    	let img8;
    	let img8_src_value;
    	let t57;
    	let div26;
    	let h47;
    	let b7;
    	let t59;
    	let a11;
    	let button11;
    	let t61;
    	let div31;
    	let div30;
    	let img9;
    	let img9_src_value;
    	let t62;
    	let div29;
    	let h48;
    	let b8;
    	let t64;
    	let a12;
    	let button12;
    	let t66;
    	let div34;
    	let div33;
    	let img10;
    	let img10_src_value;
    	let t67;
    	let div32;
    	let h49;
    	let b9;
    	let t69;
    	let a13;
    	let button13;
    	let t71;
    	let br6;
    	let t72;
    	let a14;
    	let button14;
    	let t74;
    	let br7;
    	let t75;
    	let a15;
    	let button15;
    	let t77;
    	let br8;
    	let t78;
    	let div45;
    	let div38;
    	let div37;
    	let img11;
    	let img11_src_value;
    	let t79;
    	let div36;
    	let h410;
    	let b10;
    	let t81;
    	let a16;
    	let button16;
    	let t83;
    	let div41;
    	let div40;
    	let img12;
    	let img12_src_value;
    	let t84;
    	let div39;
    	let h411;
    	let b11;
    	let t86;
    	let a17;
    	let button17;
    	let t88;
    	let br9;
    	let t89;
    	let a18;
    	let button18;
    	let t91;
    	let br10;
    	let t92;
    	let a19;
    	let button19;
    	let t94;
    	let div44;
    	let div43;
    	let img13;
    	let img13_src_value;
    	let t95;
    	let div42;
    	let h412;
    	let b12;
    	let t97;
    	let a20;
    	let button20;
    	let t99;
    	let br11;
    	let t100;
    	let div55;
    	let div48;
    	let div47;
    	let img14;
    	let img14_src_value;
    	let t101;
    	let div46;
    	let h413;
    	let b13;
    	let t103;
    	let a21;
    	let button21;
    	let t105;
    	let br12;
    	let t106;
    	let a22;
    	let button22;
    	let t108;
    	let br13;
    	let t109;
    	let a23;
    	let button23;
    	let t111;
    	let div51;
    	let div50;
    	let img15;
    	let img15_src_value;
    	let t112;
    	let div49;
    	let h414;
    	let b14;
    	let t114;
    	let a24;
    	let button24;
    	let t116;
    	let div54;
    	let div53;
    	let img16;
    	let img16_src_value;
    	let t117;
    	let div52;
    	let h415;
    	let b15;
    	let t119;
    	let a25;
    	let button25;
    	let t121;
    	let br14;
    	let t122;
    	let div65;
    	let div58;
    	let div57;
    	let img17;
    	let img17_src_value;
    	let t123;
    	let div56;
    	let h416;
    	let b16;
    	let t125;
    	let a26;
    	let button26;
    	let t127;
    	let div61;
    	let div60;
    	let img18;
    	let img18_src_value;
    	let t128;
    	let div59;
    	let h417;
    	let b17;
    	let t130;
    	let a27;
    	let button27;
    	let t132;
    	let div64;
    	let div63;
    	let img19;
    	let img19_src_value;
    	let t133;
    	let div62;
    	let h418;
    	let b18;
    	let t135;
    	let a28;
    	let button28;
    	let t137;
    	let br15;
    	let t138;
    	let div75;
    	let div68;
    	let div67;
    	let img20;
    	let img20_src_value;
    	let t139;
    	let div66;
    	let h419;
    	let b19;
    	let t141;
    	let a29;
    	let button29;
    	let t143;
    	let div71;
    	let div70;
    	let img21;
    	let img21_src_value;
    	let t144;
    	let div69;
    	let h420;
    	let b20;
    	let t146;
    	let a30;
    	let button30;
    	let t148;
    	let div74;
    	let div73;
    	let img22;
    	let img22_src_value;
    	let t149;
    	let div72;
    	let h421;
    	let b21;
    	let t151;
    	let a31;
    	let button31;
    	let t153;
    	let br16;
    	let t154;
    	let div85;
    	let div78;
    	let div77;
    	let img23;
    	let img23_src_value;
    	let t155;
    	let div76;
    	let h422;
    	let b22;
    	let t157;
    	let a32;
    	let button32;
    	let t159;
    	let div81;
    	let div80;
    	let img24;
    	let img24_src_value;
    	let t160;
    	let div79;
    	let h423;
    	let b23;
    	let t162;
    	let a33;
    	let button33;
    	let t164;
    	let div84;
    	let div83;
    	let img25;
    	let img25_src_value;
    	let t165;
    	let div82;
    	let h424;
    	let b24;
    	let t167;
    	let a34;
    	let button34;
    	let t169;
    	let br17;
    	let t170;
    	let div95;
    	let div88;
    	let div87;
    	let div86;
    	let h425;
    	let b25;
    	let t172;
    	let a35;
    	let button35;
    	let t174;
    	let div91;
    	let div90;
    	let div89;
    	let h426;
    	let b26;
    	let t176;
    	let a36;
    	let button36;
    	let t178;
    	let div94;
    	let div93;
    	let div92;
    	let h427;
    	let b27;
    	let t180;
    	let a37;
    	let button37;
    	let t182;
    	let br18;

    	const block = {
    		c: function create() {
    			main = element("main");
    			img0 = element("img");
    			t0 = space();
    			div96 = element("div");
    			h10 = element("h1");
    			h10.textContent = "LEAGUE OF LEGENDS";
    			t2 = space();
    			div5 = element("div");
    			div0 = element("div");
    			t3 = space();
    			div3 = element("div");
    			div2 = element("div");
    			img1 = element("img");
    			t4 = space();
    			div1 = element("div");
    			h40 = element("h4");
    			b0 = element("b");
    			b0.textContent = "League Of Legends";
    			t6 = space();
    			a0 = element("a");
    			button0 = element("button");
    			button0.textContent = "Link";
    			t8 = space();
    			div4 = element("div");
    			t9 = space();
    			h11 = element("h1");
    			h11.textContent = "STREAMERS";
    			t11 = space();
    			hr = element("hr");
    			t12 = space();
    			div15 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			img2 = element("img");
    			t13 = space();
    			div6 = element("div");
    			h41 = element("h4");
    			b1 = element("b");
    			b1.textContent = "Werlyb";
    			t15 = space();
    			a1 = element("a");
    			button1 = element("button");
    			button1.textContent = "Link";
    			t17 = space();
    			br0 = element("br");
    			t18 = space();
    			a2 = element("a");
    			button2 = element("button");
    			button2.textContent = "OPGG1";
    			t20 = space();
    			br1 = element("br");
    			t21 = space();
    			a3 = element("a");
    			button3 = element("button");
    			button3.textContent = "TwitchVOD";
    			t23 = space();
    			div11 = element("div");
    			div10 = element("div");
    			img3 = element("img");
    			t24 = space();
    			div9 = element("div");
    			h42 = element("h4");
    			b2 = element("b");
    			b2.textContent = "Elyoya";
    			t26 = space();
    			a4 = element("a");
    			button4 = element("button");
    			button4.textContent = "Link";
    			t28 = space();
    			div14 = element("div");
    			div13 = element("div");
    			img4 = element("img");
    			t29 = space();
    			div12 = element("div");
    			h43 = element("h4");
    			b3 = element("b");
    			b3.textContent = "Skain";
    			t31 = space();
    			a5 = element("a");
    			button5 = element("button");
    			button5.textContent = "Link";
    			t33 = space();
    			br2 = element("br");
    			t34 = space();
    			div25 = element("div");
    			div18 = element("div");
    			div17 = element("div");
    			img5 = element("img");
    			t35 = space();
    			div16 = element("div");
    			h44 = element("h4");
    			b4 = element("b");
    			b4.textContent = "Koldo";
    			t37 = space();
    			a6 = element("a");
    			button6 = element("button");
    			button6.textContent = "Link";
    			t39 = space();
    			div21 = element("div");
    			div20 = element("div");
    			img6 = element("img");
    			t40 = space();
    			div19 = element("div");
    			h45 = element("h4");
    			b5 = element("b");
    			b5.textContent = "ElOjoNinja";
    			t42 = space();
    			a7 = element("a");
    			button7 = element("button");
    			button7.textContent = "Link";
    			t44 = space();
    			br3 = element("br");
    			t45 = space();
    			a8 = element("a");
    			button8 = element("button");
    			button8.textContent = "OPGG1";
    			t47 = space();
    			br4 = element("br");
    			t48 = space();
    			a9 = element("a");
    			button9 = element("button");
    			button9.textContent = "TwitchVOD";
    			t50 = space();
    			div24 = element("div");
    			div23 = element("div");
    			img7 = element("img");
    			t51 = space();
    			div22 = element("div");
    			h46 = element("h4");
    			b6 = element("b");
    			b6.textContent = "Kerios";
    			t53 = space();
    			a10 = element("a");
    			button10 = element("button");
    			button10.textContent = "Link";
    			t55 = space();
    			br5 = element("br");
    			t56 = space();
    			div35 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			img8 = element("img");
    			t57 = space();
    			div26 = element("div");
    			h47 = element("h4");
    			b7 = element("b");
    			b7.textContent = "CarmenSandwich";
    			t59 = space();
    			a11 = element("a");
    			button11 = element("button");
    			button11.textContent = "Link";
    			t61 = space();
    			div31 = element("div");
    			div30 = element("div");
    			img9 = element("img");
    			t62 = space();
    			div29 = element("div");
    			h48 = element("h4");
    			b8 = element("b");
    			b8.textContent = "Nissaxter";
    			t64 = space();
    			a12 = element("a");
    			button12 = element("button");
    			button12.textContent = "Link";
    			t66 = space();
    			div34 = element("div");
    			div33 = element("div");
    			img10 = element("img");
    			t67 = space();
    			div32 = element("div");
    			h49 = element("h4");
    			b9 = element("b");
    			b9.textContent = "ffaka";
    			t69 = space();
    			a13 = element("a");
    			button13 = element("button");
    			button13.textContent = "Link";
    			t71 = space();
    			br6 = element("br");
    			t72 = space();
    			a14 = element("a");
    			button14 = element("button");
    			button14.textContent = "OPGG1";
    			t74 = space();
    			br7 = element("br");
    			t75 = space();
    			a15 = element("a");
    			button15 = element("button");
    			button15.textContent = "TwitchVOD";
    			t77 = space();
    			br8 = element("br");
    			t78 = space();
    			div45 = element("div");
    			div38 = element("div");
    			div37 = element("div");
    			img11 = element("img");
    			t79 = space();
    			div36 = element("div");
    			h410 = element("h4");
    			b10 = element("b");
    			b10.textContent = "Pochipoom";
    			t81 = space();
    			a16 = element("a");
    			button16 = element("button");
    			button16.textContent = "Link";
    			t83 = space();
    			div41 = element("div");
    			div40 = element("div");
    			img12 = element("img");
    			t84 = space();
    			div39 = element("div");
    			h411 = element("h4");
    			b11 = element("b");
    			b11.textContent = "Zeling";
    			t86 = space();
    			a17 = element("a");
    			button17 = element("button");
    			button17.textContent = "Link";
    			t88 = space();
    			br9 = element("br");
    			t89 = space();
    			a18 = element("a");
    			button18 = element("button");
    			button18.textContent = "OPGG1";
    			t91 = space();
    			br10 = element("br");
    			t92 = space();
    			a19 = element("a");
    			button19 = element("button");
    			button19.textContent = "TwitchVOD";
    			t94 = space();
    			div44 = element("div");
    			div43 = element("div");
    			img13 = element("img");
    			t95 = space();
    			div42 = element("div");
    			h412 = element("h4");
    			b12 = element("b");
    			b12.textContent = "JavierrLoL";
    			t97 = space();
    			a20 = element("a");
    			button20 = element("button");
    			button20.textContent = "Link";
    			t99 = space();
    			br11 = element("br");
    			t100 = space();
    			div55 = element("div");
    			div48 = element("div");
    			div47 = element("div");
    			img14 = element("img");
    			t101 = space();
    			div46 = element("div");
    			h413 = element("h4");
    			b13 = element("b");
    			b13.textContent = "Th3Antonio";
    			t103 = space();
    			a21 = element("a");
    			button21 = element("button");
    			button21.textContent = "Link";
    			t105 = space();
    			br12 = element("br");
    			t106 = space();
    			a22 = element("a");
    			button22 = element("button");
    			button22.textContent = "OPGG1";
    			t108 = space();
    			br13 = element("br");
    			t109 = space();
    			a23 = element("a");
    			button23 = element("button");
    			button23.textContent = "TwitchVOD";
    			t111 = space();
    			div51 = element("div");
    			div50 = element("div");
    			img15 = element("img");
    			t112 = space();
    			div49 = element("div");
    			h414 = element("h4");
    			b14 = element("b");
    			b14.textContent = "send0o";
    			t114 = space();
    			a24 = element("a");
    			button24 = element("button");
    			button24.textContent = "Link";
    			t116 = space();
    			div54 = element("div");
    			div53 = element("div");
    			img16 = element("img");
    			t117 = space();
    			div52 = element("div");
    			h415 = element("h4");
    			b15 = element("b");
    			b15.textContent = "xixauxas";
    			t119 = space();
    			a25 = element("a");
    			button25 = element("button");
    			button25.textContent = "Link";
    			t121 = space();
    			br14 = element("br");
    			t122 = space();
    			div65 = element("div");
    			div58 = element("div");
    			div57 = element("div");
    			img17 = element("img");
    			t123 = space();
    			div56 = element("div");
    			h416 = element("h4");
    			b16 = element("b");
    			b16.textContent = "grekko_";
    			t125 = space();
    			a26 = element("a");
    			button26 = element("button");
    			button26.textContent = "Link";
    			t127 = space();
    			div61 = element("div");
    			div60 = element("div");
    			img18 = element("img");
    			t128 = space();
    			div59 = element("div");
    			h417 = element("h4");
    			b17 = element("b");
    			b17.textContent = "Pausenpaii";
    			t130 = space();
    			a27 = element("a");
    			button27 = element("button");
    			button27.textContent = "Link";
    			t132 = space();
    			div64 = element("div");
    			div63 = element("div");
    			img19 = element("img");
    			t133 = space();
    			div62 = element("div");
    			h418 = element("h4");
    			b18 = element("b");
    			b18.textContent = "holasoysergio1";
    			t135 = space();
    			a28 = element("a");
    			button28 = element("button");
    			button28.textContent = "Link";
    			t137 = space();
    			br15 = element("br");
    			t138 = space();
    			div75 = element("div");
    			div68 = element("div");
    			div67 = element("div");
    			img20 = element("img");
    			t139 = space();
    			div66 = element("div");
    			h419 = element("h4");
    			b19 = element("b");
    			b19.textContent = "miniduke";
    			t141 = space();
    			a29 = element("a");
    			button29 = element("button");
    			button29.textContent = "Link";
    			t143 = space();
    			div71 = element("div");
    			div70 = element("div");
    			img21 = element("img");
    			t144 = space();
    			div69 = element("div");
    			h420 = element("h4");
    			b20 = element("b");
    			b20.textContent = "getflakked";
    			t146 = space();
    			a30 = element("a");
    			button30 = element("button");
    			button30.textContent = "Link";
    			t148 = space();
    			div74 = element("div");
    			div73 = element("div");
    			img22 = element("img");
    			t149 = space();
    			div72 = element("div");
    			h421 = element("h4");
    			b21 = element("b");
    			b21.textContent = "elmiillor";
    			t151 = space();
    			a31 = element("a");
    			button31 = element("button");
    			button31.textContent = "Link";
    			t153 = space();
    			br16 = element("br");
    			t154 = space();
    			div85 = element("div");
    			div78 = element("div");
    			div77 = element("div");
    			img23 = element("img");
    			t155 = space();
    			div76 = element("div");
    			h422 = element("h4");
    			b22 = element("b");
    			b22.textContent = "pepiinero";
    			t157 = space();
    			a32 = element("a");
    			button32 = element("button");
    			button32.textContent = "Link";
    			t159 = space();
    			div81 = element("div");
    			div80 = element("div");
    			img24 = element("img");
    			t160 = space();
    			div79 = element("div");
    			h423 = element("h4");
    			b23 = element("b");
    			b23.textContent = "jaimemellado_";
    			t162 = space();
    			a33 = element("a");
    			button33 = element("button");
    			button33.textContent = "Link";
    			t164 = space();
    			div84 = element("div");
    			div83 = element("div");
    			img25 = element("img");
    			t165 = space();
    			div82 = element("div");
    			h424 = element("h4");
    			b24 = element("b");
    			b24.textContent = "champi14";
    			t167 = space();
    			a34 = element("a");
    			button34 = element("button");
    			button34.textContent = "Link";
    			t169 = space();
    			br17 = element("br");
    			t170 = space();
    			div95 = element("div");
    			div88 = element("div");
    			div87 = element("div");
    			div86 = element("div");
    			h425 = element("h4");
    			b25 = element("b");
    			b25.textContent = "Ibai";
    			t172 = space();
    			a35 = element("a");
    			button35 = element("button");
    			button35.textContent = "Link";
    			t174 = space();
    			div91 = element("div");
    			div90 = element("div");
    			div89 = element("div");
    			h426 = element("h4");
    			b26 = element("b");
    			b26.textContent = "knekro";
    			t176 = space();
    			a36 = element("a");
    			button36 = element("button");
    			button36.textContent = "Link";
    			t178 = space();
    			div94 = element("div");
    			div93 = element("div");
    			div92 = element("div");
    			h427 = element("h4");
    			b27 = element("b");
    			b27.textContent = "tusm";
    			t180 = space();
    			a37 = element("a");
    			button37 = element("button");
    			button37.textContent = "Link";
    			t182 = space();
    			br18 = element("br");
    			if (!src_url_equal(img0.src, img0_src_value = "https://yt3.ggpht.com/GA_nP6ncktdWMvtZoj1G_8Ef98M75Bm-hWyhB91Qh8DNzaJs7JoQfhEBH43fxI6PSQZ2aPDj-Q=w2120-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Avatar");
    			set_style(img0, "width", "100%");
    			add_location(img0, file$B, 14, 3, 361);
    			add_location(h10, file$B, 20, 8, 596);
    			attr_dev(div0, "class", "col-sm-3");
    			attr_dev(div0, "id", "hola");
    			add_location(div0, file$B, 22, 12, 661);
    			if (!src_url_equal(img1.src, img1_src_value = "https://www.leagueoflegends.com/static/open-graph-2e582ae9fae8b0b396ca46ff21fd47a8.jpg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Avatar");
    			set_style(img1, "width", "100%");
    			add_location(img1, file$B, 29, 20, 894);
    			add_location(b0, file$B, 35, 28, 1191);
    			add_location(h40, file$B, 35, 24, 1187);
    			attr_dev(button0, "class", "btn btn-primary");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$B, 37, 24, 1299);
    			attr_dev(a0, "href", "/#/leagueoflegends");
    			add_location(a0, file$B, 36, 24, 1245);
    			attr_dev(div1, "class", "container svelte-110ltv7");
    			add_location(div1, file$B, 34, 20, 1139);
    			attr_dev(div2, "class", "card svelte-110ltv7");
    			add_location(div2, file$B, 28, 16, 855);
    			attr_dev(div3, "class", "col-sm-6");
    			attr_dev(div3, "id", "hola");
    			add_location(div3, file$B, 26, 12, 774);
    			attr_dev(div4, "class", "col-sm-3");
    			attr_dev(div4, "id", "hola");
    			add_location(div4, file$B, 44, 12, 1523);
    			attr_dev(div5, "class", "row");
    			add_location(div5, file$B, 21, 8, 631);
    			add_location(h11, file$B, 50, 8, 1659);
    			add_location(hr, file$B, 51, 8, 1688);
    			if (!src_url_equal(img2.src, img2_src_value = "https://pbs.twimg.com/media/FQP-l60XIAEbMF3?format=jpg&name=large")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Avatar");
    			set_style(img2, "width", "100%");
    			add_location(img2, file$B, 56, 20, 1841);
    			add_location(b1, file$B, 62, 28, 2117);
    			add_location(h41, file$B, 62, 24, 2113);
    			attr_dev(button1, "class", "btn btn-primary");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$B, 63, 44, 2180);
    			attr_dev(a1, "href", "/#/werlyb");
    			add_location(a1, file$B, 63, 24, 2160);
    			add_location(br0, file$B, 64, 24, 2268);
    			attr_dev(button2, "class", "btn btn-info");
    			attr_dev(button2, "type", "button");
    			add_location(button2, file$B, 65, 120, 2393);
    			attr_dev(a2, "href", "https://www.op.gg/summoners/euw/illo%20wely");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			add_location(a2, file$B, 65, 24, 2297);
    			add_location(br1, file$B, 66, 24, 2479);
    			attr_dev(button3, "class", "btn btn-danger");
    			attr_dev(button3, "type", "button");
    			add_location(button3, file$B, 67, 138, 2622);
    			attr_dev(a3, "href", "https://www.twitch.tv/werlyb/videos?filter=archives&sort=time");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			add_location(a3, file$B, 67, 24, 2508);
    			attr_dev(div6, "class", "container svelte-110ltv7");
    			add_location(div6, file$B, 61, 20, 2065);
    			attr_dev(div7, "class", "card svelte-110ltv7");
    			add_location(div7, file$B, 55, 16, 1802);
    			attr_dev(div8, "class", "col-sm-4");
    			add_location(div8, file$B, 53, 12, 1731);
    			if (!src_url_equal(img3.src, img3_src_value = "https://pbs.twimg.com/media/FQKbAXjWQAMA8eI?format=jpg&name=large")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "Avatar");
    			set_style(img3, "width", "100%");
    			add_location(img3, file$B, 74, 20, 2881);
    			add_location(b2, file$B, 80, 28, 3157);
    			add_location(h42, file$B, 80, 24, 3153);
    			attr_dev(button4, "class", "btn btn-primary");
    			attr_dev(button4, "type", "submit");
    			add_location(button4, file$B, 82, 24, 3245);
    			attr_dev(a4, "href", "/#/elyoya");
    			add_location(a4, file$B, 81, 24, 3200);
    			attr_dev(div9, "class", "container svelte-110ltv7");
    			add_location(div9, file$B, 79, 20, 3105);
    			attr_dev(div10, "class", "card svelte-110ltv7");
    			add_location(div10, file$B, 73, 16, 2842);
    			attr_dev(div11, "class", "col-sm-4");
    			add_location(div11, file$B, 71, 12, 2771);
    			if (!src_url_equal(img4.src, img4_src_value = "https://pbs.twimg.com/media/FQJ4MU3X0AAc8y_?format=jpg&name=large")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "Avatar");
    			set_style(img4, "width", "100%");
    			add_location(img4, file$B, 92, 20, 3578);
    			add_location(b3, file$B, 98, 28, 3854);
    			add_location(h43, file$B, 98, 24, 3850);
    			attr_dev(button5, "class", "btn btn-primary");
    			attr_dev(button5, "type", "submit");
    			add_location(button5, file$B, 100, 24, 3940);
    			attr_dev(a5, "href", "/#/skain");
    			add_location(a5, file$B, 99, 24, 3896);
    			attr_dev(div12, "class", "container svelte-110ltv7");
    			add_location(div12, file$B, 97, 20, 3802);
    			attr_dev(div13, "class", "card svelte-110ltv7");
    			add_location(div13, file$B, 91, 16, 3539);
    			attr_dev(div14, "class", "col-sm-4");
    			add_location(div14, file$B, 89, 12, 3469);
    			attr_dev(div15, "class", "row");
    			add_location(div15, file$B, 52, 8, 1701);
    			add_location(br2, file$B, 108, 8, 4175);
    			if (!src_url_equal(img5.src, img5_src_value = "https://pbs.twimg.com/media/FQFqifWXwAA8K8v?format=jpg&name=large")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "Avatar");
    			set_style(img5, "width", "100%");
    			add_location(img5, file$B, 113, 20, 4327);
    			add_location(b4, file$B, 119, 28, 4603);
    			add_location(h44, file$B, 119, 24, 4599);
    			attr_dev(button6, "class", "btn btn-primary");
    			attr_dev(button6, "type", "submit");
    			add_location(button6, file$B, 121, 24, 4689);
    			attr_dev(a6, "href", "/#/koldo");
    			add_location(a6, file$B, 120, 24, 4645);
    			attr_dev(div16, "class", "container svelte-110ltv7");
    			add_location(div16, file$B, 118, 20, 4551);
    			attr_dev(div17, "class", "card svelte-110ltv7");
    			add_location(div17, file$B, 112, 16, 4288);
    			attr_dev(div18, "class", "col-sm-4");
    			add_location(div18, file$B, 110, 12, 4218);
    			if (!src_url_equal(img6.src, img6_src_value = "https://pbs.twimg.com/media/FQFOn-7XIAIvec2?format=jpg&name=large")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "Avatar");
    			set_style(img6, "width", "100%");
    			add_location(img6, file$B, 131, 20, 5027);
    			add_location(b5, file$B, 137, 28, 5303);
    			add_location(h45, file$B, 137, 24, 5299);
    			attr_dev(button7, "class", "btn btn-primary");
    			attr_dev(button7, "type", "submit");
    			add_location(button7, file$B, 138, 48, 5374);
    			attr_dev(a7, "href", "/#/elojoninja");
    			add_location(a7, file$B, 138, 24, 5350);
    			add_location(br3, file$B, 139, 24, 5462);
    			attr_dev(button8, "class", "btn btn-info");
    			attr_dev(button8, "type", "button");
    			add_location(button8, file$B, 140, 127, 5594);
    			attr_dev(a8, "href", "https://www.op.gg/summoners/euw/NoDiscord%20NoGank");
    			attr_dev(a8, "target", "_blank");
    			attr_dev(a8, "rel", "noopener noreferrer");
    			add_location(a8, file$B, 140, 24, 5491);
    			add_location(br4, file$B, 141, 24, 5680);
    			attr_dev(button9, "class", "btn btn-danger");
    			attr_dev(button9, "type", "button");
    			add_location(button9, file$B, 142, 142, 5827);
    			attr_dev(a9, "href", "https://www.twitch.tv/elojoninja/videos?filter=archives&sort=time");
    			attr_dev(a9, "target", "_blank");
    			attr_dev(a9, "rel", "noopener noreferrer");
    			add_location(a9, file$B, 142, 24, 5709);
    			attr_dev(div19, "class", "container svelte-110ltv7");
    			add_location(div19, file$B, 136, 20, 5251);
    			attr_dev(div20, "class", "card svelte-110ltv7");
    			add_location(div20, file$B, 130, 16, 4988);
    			attr_dev(div21, "class", "col-sm-4");
    			add_location(div21, file$B, 128, 12, 4913);
    			if (!src_url_equal(img7.src, img7_src_value = "https://pbs.twimg.com/profile_images/1517656601305489410/8VnjvSeV_400x400.jpg")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "Avatar");
    			set_style(img7, "width", "100%");
    			add_location(img7, file$B, 150, 20, 6098);
    			add_location(b6, file$B, 156, 28, 6386);
    			add_location(h46, file$B, 156, 24, 6382);
    			attr_dev(button10, "class", "btn btn-primary");
    			attr_dev(button10, "type", "submit");
    			add_location(button10, file$B, 158, 24, 6474);
    			attr_dev(a10, "href", "/#/kerios");
    			add_location(a10, file$B, 157, 24, 6429);
    			attr_dev(div22, "class", "container svelte-110ltv7");
    			add_location(div22, file$B, 155, 20, 6334);
    			attr_dev(div23, "class", "card svelte-110ltv7");
    			add_location(div23, file$B, 149, 16, 6059);
    			attr_dev(div24, "class", "col-sm-4");
    			add_location(div24, file$B, 147, 12, 5989);
    			attr_dev(div25, "class", "row");
    			add_location(div25, file$B, 109, 8, 4188);
    			add_location(br5, file$B, 166, 8, 6709);
    			if (!src_url_equal(img8.src, img8_src_value = "https://static-cdn.jtvnw.net/jtv_user_pictures/2ae11698-5cf7-4ff8-a11d-fd66339a5001-profile_image-300x300.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "Avatar");
    			set_style(img8, "width", "100%");
    			add_location(img8, file$B, 171, 20, 6862);
    			add_location(b7, file$B, 177, 28, 7182);
    			add_location(h47, file$B, 177, 24, 7178);
    			attr_dev(button11, "class", "btn btn-primary");
    			attr_dev(button11, "type", "submit");
    			add_location(button11, file$B, 179, 24, 7286);
    			attr_dev(a11, "href", "/#/CarmenSandwich");
    			add_location(a11, file$B, 178, 24, 7233);
    			attr_dev(div26, "class", "container svelte-110ltv7");
    			add_location(div26, file$B, 176, 20, 7130);
    			attr_dev(div27, "class", "card svelte-110ltv7");
    			add_location(div27, file$B, 170, 16, 6823);
    			attr_dev(div28, "class", "col-sm-4");
    			add_location(div28, file$B, 168, 12, 6752);
    			if (!src_url_equal(img9.src, img9_src_value = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShMLoVS8apiEXEAKwZO8elfG-U9_fJlc5yRim-iEnXR1oKpUvHL72MmWAzZmxtNW83DlI&usqp=CAU")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "Avatar");
    			set_style(img9, "width", "100%");
    			add_location(img9, file$B, 189, 20, 7594);
    			add_location(b8, file$B, 195, 28, 7937);
    			add_location(h48, file$B, 195, 24, 7933);
    			attr_dev(button12, "class", "btn btn-primary");
    			attr_dev(button12, "type", "submit");
    			add_location(button12, file$B, 197, 24, 8031);
    			attr_dev(a12, "href", "/#/nissaxter");
    			add_location(a12, file$B, 196, 24, 7983);
    			attr_dev(div29, "class", "container svelte-110ltv7");
    			add_location(div29, file$B, 194, 20, 7885);
    			attr_dev(div30, "class", "card svelte-110ltv7");
    			add_location(div30, file$B, 188, 16, 7555);
    			attr_dev(div31, "class", "col-sm-4");
    			add_location(div31, file$B, 186, 12, 7510);
    			if (!src_url_equal(img10.src, img10_src_value = "https://preview.redd.it/22n3fjbpzqm71.png?width=544&format=png&auto=webp&s=16b39c76b61edc83f32398d263135cb3bcddcf79")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "Avatar");
    			set_style(img10, "width", "100%");
    			add_location(img10, file$B, 207, 20, 8350);
    			add_location(b9, file$B, 213, 28, 8676);
    			add_location(h49, file$B, 213, 24, 8672);
    			attr_dev(button13, "class", "btn btn-primary");
    			attr_dev(button13, "type", "submit");
    			add_location(button13, file$B, 215, 24, 8762);
    			attr_dev(a13, "href", "/#/ffaka");
    			add_location(a13, file$B, 214, 24, 8718);
    			add_location(br6, file$B, 219, 24, 8929);
    			attr_dev(button14, "class", "btn btn-info");
    			attr_dev(button14, "type", "button");
    			add_location(button14, file$B, 220, 112, 9046);
    			attr_dev(a14, "href", "https://www.op.gg/summoners/euw/fak");
    			attr_dev(a14, "target", "_blank");
    			attr_dev(a14, "rel", "noopener noreferrer");
    			add_location(a14, file$B, 220, 24, 8958);
    			add_location(br7, file$B, 221, 24, 9132);
    			attr_dev(button15, "class", "btn btn-danger");
    			attr_dev(button15, "type", "button");
    			add_location(button15, file$B, 222, 137, 9274);
    			attr_dev(a15, "href", "https://www.twitch.tv/ffaka/videos?filter=archives&sort=time");
    			attr_dev(a15, "target", "_blank");
    			attr_dev(a15, "rel", "noopener noreferrer");
    			add_location(a15, file$B, 222, 24, 9161);
    			attr_dev(div32, "class", "container svelte-110ltv7");
    			add_location(div32, file$B, 212, 20, 8624);
    			attr_dev(div33, "class", "card svelte-110ltv7");
    			add_location(div33, file$B, 206, 16, 8311);
    			attr_dev(div34, "class", "col-sm-4");
    			add_location(div34, file$B, 204, 12, 8255);
    			attr_dev(div35, "class", "row");
    			add_location(div35, file$B, 167, 8, 6722);
    			add_location(br8, file$B, 228, 8, 9435);
    			if (!src_url_equal(img11.src, img11_src_value = "https://pbs.twimg.com/profile_images/1517591285841944577/hJUqhRnY_400x400.jpg")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "Avatar");
    			set_style(img11, "width", "100%");
    			add_location(img11, file$B, 233, 20, 9573);
    			add_location(b10, file$B, 239, 28, 9861);
    			add_location(h410, file$B, 239, 24, 9857);
    			attr_dev(button16, "class", "btn btn-primary");
    			attr_dev(button16, "type", "submit");
    			add_location(button16, file$B, 241, 24, 9955);
    			attr_dev(a16, "href", "/#/pochipoom");
    			add_location(a16, file$B, 240, 24, 9907);
    			attr_dev(div36, "class", "container svelte-110ltv7");
    			add_location(div36, file$B, 238, 20, 9809);
    			attr_dev(div37, "class", "card svelte-110ltv7");
    			add_location(div37, file$B, 232, 16, 9534);
    			attr_dev(div38, "class", "col-sm-4");
    			add_location(div38, file$B, 230, 12, 9478);
    			if (!src_url_equal(img12.src, img12_src_value = "https://everipedia-storage.s3.amazonaws.com/ProfilePicture/lang_en/zeling/mainphoto_medium.webp")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "Avatar");
    			set_style(img12, "width", "100%");
    			add_location(img12, file$B, 252, 20, 10296);
    			add_location(b11, file$B, 258, 28, 10602);
    			add_location(h411, file$B, 258, 24, 10598);
    			attr_dev(button17, "class", "btn btn-primary");
    			attr_dev(button17, "type", "submit");
    			add_location(button17, file$B, 259, 44, 10665);
    			attr_dev(a17, "href", "/#/Zeling");
    			add_location(a17, file$B, 259, 24, 10645);
    			add_location(br9, file$B, 260, 24, 10753);
    			attr_dev(button18, "class", "btn btn-info");
    			attr_dev(button18, "type", "button");
    			add_location(button18, file$B, 261, 122, 10880);
    			attr_dev(a18, "href", "https://www.op.gg/summoners/euw/AsocialPlayer");
    			attr_dev(a18, "target", "_blank");
    			attr_dev(a18, "rel", "noopener noreferrer");
    			add_location(a18, file$B, 261, 24, 10782);
    			add_location(br10, file$B, 262, 24, 10966);
    			attr_dev(button19, "class", "btn btn-danger");
    			attr_dev(button19, "type", "button");
    			add_location(button19, file$B, 263, 138, 11109);
    			attr_dev(a19, "href", "https://www.twitch.tv/zeling/videos?filter=archives&sort=time");
    			attr_dev(a19, "target", "_blank");
    			attr_dev(a19, "rel", "noopener noreferrer");
    			add_location(a19, file$B, 263, 24, 10995);
    			attr_dev(div39, "class", "container svelte-110ltv7");
    			add_location(div39, file$B, 257, 20, 10550);
    			attr_dev(div40, "class", "card svelte-110ltv7");
    			add_location(div40, file$B, 251, 16, 10257);
    			attr_dev(div41, "class", "col-sm-4");
    			add_location(div41, file$B, 249, 12, 10202);
    			if (!src_url_equal(img13.src, img13_src_value = "https://pbs.twimg.com/media/ERYyoASXsAAFt9-?format=jpg&name=4096x4096")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "Avatar");
    			set_style(img13, "width", "100%");
    			add_location(img13, file$B, 271, 20, 11354);
    			add_location(b12, file$B, 277, 28, 11634);
    			add_location(h412, file$B, 277, 24, 11630);
    			attr_dev(button20, "class", "btn btn-primary");
    			attr_dev(button20, "type", "submit");
    			add_location(button20, file$B, 279, 24, 11730);
    			attr_dev(a20, "href", "/#/JavierrLoL");
    			add_location(a20, file$B, 278, 24, 11681);
    			attr_dev(div42, "class", "container svelte-110ltv7");
    			add_location(div42, file$B, 276, 20, 11582);
    			attr_dev(div43, "class", "card svelte-110ltv7");
    			add_location(div43, file$B, 270, 16, 11315);
    			attr_dev(div44, "class", "col-sm-4");
    			add_location(div44, file$B, 268, 12, 11259);
    			attr_dev(div45, "class", "row");
    			add_location(div45, file$B, 229, 8, 9448);
    			add_location(br11, file$B, 287, 8, 11965);
    			if (!src_url_equal(img14.src, img14_src_value = "https://esports.eldesmarque.com/wp-content/uploads/2018/10/Th3Antonio-Giants.jpg")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "Avatar");
    			set_style(img14, "width", "100%");
    			add_location(img14, file$B, 292, 20, 12102);
    			add_location(b13, file$B, 298, 28, 12393);
    			add_location(h413, file$B, 298, 24, 12389);
    			attr_dev(button21, "class", "btn btn-primary");
    			attr_dev(button21, "type", "submit");
    			add_location(button21, file$B, 300, 24, 12489);
    			attr_dev(a21, "href", "/#/Th3Antonio");
    			add_location(a21, file$B, 299, 24, 12440);
    			add_location(br12, file$B, 304, 24, 12656);
    			attr_dev(button22, "class", "btn btn-info");
    			attr_dev(button22, "type", "button");
    			add_location(button22, file$B, 305, 118, 12779);
    			attr_dev(a22, "href", "https://www.op.gg/summoners/euw/GIA%20TH3");
    			attr_dev(a22, "target", "_blank");
    			attr_dev(a22, "rel", "noopener noreferrer");
    			add_location(a22, file$B, 305, 24, 12685);
    			add_location(br13, file$B, 306, 24, 12865);
    			attr_dev(button23, "class", "btn btn-danger");
    			attr_dev(button23, "type", "button");
    			add_location(button23, file$B, 307, 142, 13012);
    			attr_dev(a23, "href", "https://www.twitch.tv/th3antonio/videos?filter=archives&sort=time");
    			attr_dev(a23, "target", "_blank");
    			attr_dev(a23, "rel", "noopener noreferrer");
    			add_location(a23, file$B, 307, 24, 12894);
    			attr_dev(div46, "class", "container svelte-110ltv7");
    			add_location(div46, file$B, 297, 20, 12341);
    			attr_dev(div47, "class", "card svelte-110ltv7");
    			add_location(div47, file$B, 291, 16, 12063);
    			attr_dev(div48, "class", "col-sm-4");
    			add_location(div48, file$B, 289, 12, 12008);
    			if (!src_url_equal(img15.src, img15_src_value = "https://pbs.twimg.com/media/E_-YXkjVgAA-0YV.jpg")) attr_dev(img15, "src", img15_src_value);
    			attr_dev(img15, "alt", "Avatar");
    			set_style(img15, "width", "100%");
    			add_location(img15, file$B, 315, 20, 13269);
    			add_location(b14, file$B, 321, 28, 13527);
    			add_location(h414, file$B, 321, 24, 13523);
    			attr_dev(button24, "class", "btn btn-primary");
    			attr_dev(button24, "type", "submit");
    			add_location(button24, file$B, 323, 24, 13615);
    			attr_dev(a24, "href", "/#/send0o");
    			add_location(a24, file$B, 322, 24, 13570);
    			attr_dev(div49, "class", "container svelte-110ltv7");
    			add_location(div49, file$B, 320, 20, 13475);
    			attr_dev(div50, "class", "card svelte-110ltv7");
    			add_location(div50, file$B, 314, 16, 13230);
    			attr_dev(div51, "class", "col-sm-4");
    			add_location(div51, file$B, 312, 12, 13174);
    			if (!src_url_equal(img16.src, img16_src_value = "https://pbs.twimg.com/media/EOvfrI-X0AAwCo9.png")) attr_dev(img16, "src", img16_src_value);
    			attr_dev(img16, "alt", "Avatar");
    			set_style(img16, "width", "100%");
    			add_location(img16, file$B, 333, 20, 13934);
    			add_location(b15, file$B, 339, 28, 14192);
    			add_location(h415, file$B, 339, 24, 14188);
    			attr_dev(button25, "class", "btn btn-primary");
    			attr_dev(button25, "type", "submit");
    			add_location(button25, file$B, 341, 24, 14284);
    			attr_dev(a25, "href", "/#/xixauxas");
    			add_location(a25, file$B, 340, 24, 14237);
    			attr_dev(div52, "class", "container svelte-110ltv7");
    			add_location(div52, file$B, 338, 20, 14140);
    			attr_dev(div53, "class", "card svelte-110ltv7");
    			add_location(div53, file$B, 332, 16, 13895);
    			attr_dev(div54, "class", "col-sm-4");
    			add_location(div54, file$B, 330, 12, 13839);
    			attr_dev(div55, "class", "row");
    			add_location(div55, file$B, 288, 8, 11978);
    			add_location(br14, file$B, 349, 8, 14519);
    			if (!src_url_equal(img17.src, img17_src_value = "https://pbs.twimg.com/media/FQ0KergXEAMeUBN?format=jpg&name=large")) attr_dev(img17, "src", img17_src_value);
    			attr_dev(img17, "alt", "Avatar");
    			set_style(img17, "width", "100%");
    			add_location(img17, file$B, 354, 20, 14657);
    			add_location(b16, file$B, 360, 28, 14933);
    			add_location(h416, file$B, 360, 24, 14929);
    			attr_dev(button26, "class", "btn btn-primary");
    			attr_dev(button26, "type", "submit");
    			add_location(button26, file$B, 362, 24, 15023);
    			attr_dev(a26, "href", "/#/grekko_");
    			add_location(a26, file$B, 361, 24, 14977);
    			attr_dev(div56, "class", "container svelte-110ltv7");
    			add_location(div56, file$B, 359, 20, 14881);
    			attr_dev(div57, "class", "card svelte-110ltv7");
    			add_location(div57, file$B, 353, 16, 14618);
    			attr_dev(div58, "class", "col-sm-4");
    			add_location(div58, file$B, 351, 12, 14562);
    			if (!src_url_equal(img18.src, img18_src_value = "https://pbs.twimg.com/media/FfqZ6Q_XwAIOF4L.jpg")) attr_dev(img18, "src", img18_src_value);
    			attr_dev(img18, "alt", "Avatar");
    			set_style(img18, "width", "100%");
    			add_location(img18, file$B, 372, 20, 15342);
    			add_location(b17, file$B, 378, 28, 15600);
    			add_location(h417, file$B, 378, 24, 15596);
    			attr_dev(button27, "class", "btn btn-primary");
    			attr_dev(button27, "type", "submit");
    			add_location(button27, file$B, 380, 24, 15696);
    			attr_dev(a27, "href", "/#/pausenpaii");
    			add_location(a27, file$B, 379, 24, 15647);
    			attr_dev(div59, "class", "container svelte-110ltv7");
    			add_location(div59, file$B, 377, 20, 15548);
    			attr_dev(div60, "class", "card svelte-110ltv7");
    			add_location(div60, file$B, 371, 16, 15303);
    			attr_dev(div61, "class", "col-sm-4");
    			add_location(div61, file$B, 369, 12, 15247);
    			if (!src_url_equal(img19.src, img19_src_value = "https://pbs.twimg.com/media/FBXelpLWYAAC9Pn?format=jpg&name=large")) attr_dev(img19, "src", img19_src_value);
    			attr_dev(img19, "alt", "Avatar");
    			set_style(img19, "width", "100%");
    			add_location(img19, file$B, 390, 20, 16014);
    			add_location(b18, file$B, 396, 28, 16290);
    			add_location(h418, file$B, 396, 24, 16286);
    			attr_dev(button28, "class", "btn btn-primary");
    			attr_dev(button28, "type", "submit");
    			add_location(button28, file$B, 398, 24, 16394);
    			attr_dev(a28, "href", "/#/holasoysergio1");
    			add_location(a28, file$B, 397, 24, 16341);
    			attr_dev(div62, "class", "container svelte-110ltv7");
    			add_location(div62, file$B, 395, 20, 16238);
    			attr_dev(div63, "class", "card svelte-110ltv7");
    			add_location(div63, file$B, 389, 16, 15975);
    			attr_dev(div64, "class", "col-sm-4");
    			add_location(div64, file$B, 387, 12, 15920);
    			attr_dev(div65, "class", "row");
    			add_location(div65, file$B, 350, 8, 14532);
    			add_location(br15, file$B, 406, 8, 16629);
    			if (!src_url_equal(img20.src, img20_src_value = "https://pbs.twimg.com/media/D7qn8zdX4AAbdVg?format=jpg&name=large")) attr_dev(img20, "src", img20_src_value);
    			attr_dev(img20, "alt", "Avatar");
    			set_style(img20, "width", "100%");
    			add_location(img20, file$B, 411, 20, 16767);
    			add_location(b19, file$B, 417, 28, 17043);
    			add_location(h419, file$B, 417, 24, 17039);
    			attr_dev(button29, "class", "btn btn-primary");
    			attr_dev(button29, "type", "submit");
    			add_location(button29, file$B, 419, 24, 17135);
    			attr_dev(a29, "href", "/#/miniduke");
    			add_location(a29, file$B, 418, 24, 17088);
    			attr_dev(div66, "class", "container svelte-110ltv7");
    			add_location(div66, file$B, 416, 20, 16991);
    			attr_dev(div67, "class", "card svelte-110ltv7");
    			add_location(div67, file$B, 410, 16, 16728);
    			attr_dev(div68, "class", "col-sm-4");
    			add_location(div68, file$B, 408, 12, 16672);
    			if (!src_url_equal(img21.src, img21_src_value = "https://esports.as.com/2022/03/07/league-of-legends/lec/ano-pato_1553554679_931199_688x600.jpg")) attr_dev(img21, "src", img21_src_value);
    			attr_dev(img21, "alt", "Avatar");
    			set_style(img21, "width", "100%");
    			add_location(img21, file$B, 429, 20, 17455);
    			add_location(b20, file$B, 434, 47, 17735);
    			add_location(h420, file$B, 434, 43, 17731);
    			attr_dev(button30, "class", "btn btn-primary");
    			attr_dev(button30, "type", "submit");
    			add_location(button30, file$B, 435, 48, 17806);
    			attr_dev(a30, "href", "/#/getflakked");
    			add_location(a30, file$B, 435, 24, 17782);
    			attr_dev(div69, "class", "container svelte-110ltv7");
    			add_location(div69, file$B, 434, 20, 17708);
    			attr_dev(div70, "class", "card svelte-110ltv7");
    			add_location(div70, file$B, 428, 16, 17416);
    			attr_dev(div71, "class", "col-sm-4");
    			add_location(div71, file$B, 426, 12, 17359);
    			if (!src_url_equal(img22.src, img22_src_value = "https://pbs.twimg.com/media/EhSTMbpXgAANTTu.jpg")) attr_dev(img22, "src", img22_src_value);
    			attr_dev(img22, "alt", "Avatar");
    			set_style(img22, "width", "100%");
    			add_location(img22, file$B, 442, 20, 18046);
    			add_location(b21, file$B, 448, 28, 18304);
    			add_location(h421, file$B, 448, 24, 18300);
    			attr_dev(button31, "class", "btn btn-primary");
    			attr_dev(button31, "type", "submit");
    			add_location(button31, file$B, 450, 24, 18398);
    			attr_dev(a31, "href", "/#/elmiillor");
    			add_location(a31, file$B, 449, 24, 18350);
    			attr_dev(div72, "class", "container svelte-110ltv7");
    			add_location(div72, file$B, 447, 20, 18252);
    			attr_dev(div73, "class", "card svelte-110ltv7");
    			add_location(div73, file$B, 441, 16, 18007);
    			attr_dev(div74, "class", "col-sm-4");
    			add_location(div74, file$B, 439, 12, 17951);
    			attr_dev(div75, "class", "row");
    			add_location(div75, file$B, 407, 8, 16642);
    			add_location(br16, file$B, 458, 8, 18633);
    			if (!src_url_equal(img23.src, img23_src_value = "https://static1-es.millenium.gg/articles/5/18/49/5/@/86673-19494910441-6b61572cff-k-article_image_t-1.jpg")) attr_dev(img23, "src", img23_src_value);
    			attr_dev(img23, "alt", "Avatar");
    			set_style(img23, "width", "100%");
    			add_location(img23, file$B, 463, 20, 18770);
    			add_location(b22, file$B, 469, 28, 19086);
    			add_location(h422, file$B, 469, 24, 19082);
    			attr_dev(button32, "class", "btn btn-primary");
    			attr_dev(button32, "type", "submit");
    			add_location(button32, file$B, 471, 24, 19180);
    			attr_dev(a32, "href", "/#/pepiinero");
    			add_location(a32, file$B, 470, 24, 19132);
    			attr_dev(div76, "class", "container svelte-110ltv7");
    			add_location(div76, file$B, 468, 20, 19034);
    			attr_dev(div77, "class", "card svelte-110ltv7");
    			add_location(div77, file$B, 462, 16, 18731);
    			attr_dev(div78, "class", "col-sm-4");
    			add_location(div78, file$B, 460, 12, 18676);
    			if (!src_url_equal(img24.src, img24_src_value = "https://pbs.twimg.com/profile_images/1583252034505117698/iTwqOgdw_400x400.jpg")) attr_dev(img24, "src", img24_src_value);
    			attr_dev(img24, "alt", "Avatar");
    			set_style(img24, "width", "100%");
    			add_location(img24, file$B, 481, 20, 19499);
    			add_location(b23, file$B, 487, 28, 19787);
    			add_location(h423, file$B, 487, 24, 19783);
    			attr_dev(button33, "class", "btn btn-primary");
    			attr_dev(button33, "type", "submit");
    			add_location(button33, file$B, 489, 24, 19889);
    			attr_dev(a33, "href", "/#/jaimemellado_");
    			add_location(a33, file$B, 488, 24, 19837);
    			attr_dev(div79, "class", "container svelte-110ltv7");
    			add_location(div79, file$B, 486, 20, 19735);
    			attr_dev(div80, "class", "card svelte-110ltv7");
    			add_location(div80, file$B, 480, 16, 19460);
    			attr_dev(div81, "class", "col-sm-4");
    			add_location(div81, file$B, 478, 12, 19404);
    			if (!src_url_equal(img25.src, img25_src_value = "https://pbs.twimg.com/profile_images/1544408806045663238/pRwFEzB2_400x400.jpg")) attr_dev(img25, "src", img25_src_value);
    			attr_dev(img25, "alt", "Avatar");
    			set_style(img25, "width", "100%");
    			add_location(img25, file$B, 499, 20, 20208);
    			add_location(b24, file$B, 505, 28, 20496);
    			add_location(h424, file$B, 505, 24, 20492);
    			attr_dev(button34, "class", "btn btn-primary");
    			attr_dev(button34, "type", "submit");
    			add_location(button34, file$B, 507, 24, 20588);
    			attr_dev(a34, "href", "/#/champi14");
    			add_location(a34, file$B, 506, 24, 20541);
    			attr_dev(div82, "class", "container svelte-110ltv7");
    			add_location(div82, file$B, 504, 20, 20444);
    			attr_dev(div83, "class", "card svelte-110ltv7");
    			add_location(div83, file$B, 498, 16, 20169);
    			attr_dev(div84, "class", "col-sm-4");
    			add_location(div84, file$B, 496, 12, 20113);
    			attr_dev(div85, "class", "row");
    			add_location(div85, file$B, 459, 8, 18646);
    			add_location(br17, file$B, 515, 8, 20823);
    			add_location(b25, file$B, 521, 28, 21012);
    			add_location(h425, file$B, 521, 24, 21008);
    			attr_dev(button35, "class", "btn btn-primary");
    			attr_dev(button35, "type", "submit");
    			add_location(button35, file$B, 523, 24, 21096);
    			attr_dev(a35, "href", "/#/ibai");
    			add_location(a35, file$B, 522, 24, 21053);
    			attr_dev(div86, "class", "container svelte-110ltv7");
    			add_location(div86, file$B, 520, 20, 20960);
    			attr_dev(div87, "class", "card svelte-110ltv7");
    			add_location(div87, file$B, 519, 16, 20921);
    			attr_dev(div88, "class", "col-sm-4");
    			add_location(div88, file$B, 517, 12, 20866);
    			add_location(b26, file$B, 534, 28, 21467);
    			add_location(h426, file$B, 534, 24, 21463);
    			attr_dev(button36, "class", "btn btn-primary");
    			attr_dev(button36, "type", "submit");
    			add_location(button36, file$B, 536, 24, 21555);
    			attr_dev(a36, "href", "/#/knekro");
    			add_location(a36, file$B, 535, 24, 21510);
    			attr_dev(div89, "class", "container svelte-110ltv7");
    			add_location(div89, file$B, 533, 20, 21415);
    			attr_dev(div90, "class", "card svelte-110ltv7");
    			add_location(div90, file$B, 532, 16, 21376);
    			attr_dev(div91, "class", "col-sm-4");
    			add_location(div91, file$B, 530, 12, 21320);
    			add_location(b27, file$B, 548, 28, 21947);
    			add_location(h427, file$B, 548, 24, 21943);
    			attr_dev(button37, "class", "btn btn-primary");
    			attr_dev(button37, "type", "submit");
    			add_location(button37, file$B, 550, 24, 22027);
    			attr_dev(a37, "href", "/#/");
    			add_location(a37, file$B, 549, 24, 21988);
    			attr_dev(div92, "class", "container svelte-110ltv7");
    			add_location(div92, file$B, 547, 20, 21895);
    			attr_dev(div93, "class", "card svelte-110ltv7");
    			add_location(div93, file$B, 545, 16, 21835);
    			attr_dev(div94, "class", "col-sm-4");
    			add_location(div94, file$B, 543, 12, 21779);
    			attr_dev(div95, "class", "row");
    			add_location(div95, file$B, 516, 8, 20836);
    			add_location(br18, file$B, 558, 8, 22262);
    			attr_dev(div96, "class", "container svelte-110ltv7");
    			add_location(div96, file$B, 19, 4, 564);
    			add_location(main, file$B, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, img0);
    			append_dev(main, t0);
    			append_dev(main, div96);
    			append_dev(div96, h10);
    			append_dev(div96, t2);
    			append_dev(div96, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t3);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div2, img1);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, h40);
    			append_dev(h40, b0);
    			append_dev(div1, t6);
    			append_dev(div1, a0);
    			append_dev(a0, button0);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div96, t9);
    			append_dev(div96, h11);
    			append_dev(div96, t11);
    			append_dev(div96, hr);
    			append_dev(div96, t12);
    			append_dev(div96, div15);
    			append_dev(div15, div8);
    			append_dev(div8, div7);
    			append_dev(div7, img2);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div6, h41);
    			append_dev(h41, b1);
    			append_dev(div6, t15);
    			append_dev(div6, a1);
    			append_dev(a1, button1);
    			append_dev(div6, t17);
    			append_dev(div6, br0);
    			append_dev(div6, t18);
    			append_dev(div6, a2);
    			append_dev(a2, button2);
    			append_dev(div6, t20);
    			append_dev(div6, br1);
    			append_dev(div6, t21);
    			append_dev(div6, a3);
    			append_dev(a3, button3);
    			append_dev(div15, t23);
    			append_dev(div15, div11);
    			append_dev(div11, div10);
    			append_dev(div10, img3);
    			append_dev(div10, t24);
    			append_dev(div10, div9);
    			append_dev(div9, h42);
    			append_dev(h42, b2);
    			append_dev(div9, t26);
    			append_dev(div9, a4);
    			append_dev(a4, button4);
    			append_dev(div15, t28);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, img4);
    			append_dev(div13, t29);
    			append_dev(div13, div12);
    			append_dev(div12, h43);
    			append_dev(h43, b3);
    			append_dev(div12, t31);
    			append_dev(div12, a5);
    			append_dev(a5, button5);
    			append_dev(div96, t33);
    			append_dev(div96, br2);
    			append_dev(div96, t34);
    			append_dev(div96, div25);
    			append_dev(div25, div18);
    			append_dev(div18, div17);
    			append_dev(div17, img5);
    			append_dev(div17, t35);
    			append_dev(div17, div16);
    			append_dev(div16, h44);
    			append_dev(h44, b4);
    			append_dev(div16, t37);
    			append_dev(div16, a6);
    			append_dev(a6, button6);
    			append_dev(div25, t39);
    			append_dev(div25, div21);
    			append_dev(div21, div20);
    			append_dev(div20, img6);
    			append_dev(div20, t40);
    			append_dev(div20, div19);
    			append_dev(div19, h45);
    			append_dev(h45, b5);
    			append_dev(div19, t42);
    			append_dev(div19, a7);
    			append_dev(a7, button7);
    			append_dev(div19, t44);
    			append_dev(div19, br3);
    			append_dev(div19, t45);
    			append_dev(div19, a8);
    			append_dev(a8, button8);
    			append_dev(div19, t47);
    			append_dev(div19, br4);
    			append_dev(div19, t48);
    			append_dev(div19, a9);
    			append_dev(a9, button9);
    			append_dev(div25, t50);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, img7);
    			append_dev(div23, t51);
    			append_dev(div23, div22);
    			append_dev(div22, h46);
    			append_dev(h46, b6);
    			append_dev(div22, t53);
    			append_dev(div22, a10);
    			append_dev(a10, button10);
    			append_dev(div96, t55);
    			append_dev(div96, br5);
    			append_dev(div96, t56);
    			append_dev(div96, div35);
    			append_dev(div35, div28);
    			append_dev(div28, div27);
    			append_dev(div27, img8);
    			append_dev(div27, t57);
    			append_dev(div27, div26);
    			append_dev(div26, h47);
    			append_dev(h47, b7);
    			append_dev(div26, t59);
    			append_dev(div26, a11);
    			append_dev(a11, button11);
    			append_dev(div35, t61);
    			append_dev(div35, div31);
    			append_dev(div31, div30);
    			append_dev(div30, img9);
    			append_dev(div30, t62);
    			append_dev(div30, div29);
    			append_dev(div29, h48);
    			append_dev(h48, b8);
    			append_dev(div29, t64);
    			append_dev(div29, a12);
    			append_dev(a12, button12);
    			append_dev(div35, t66);
    			append_dev(div35, div34);
    			append_dev(div34, div33);
    			append_dev(div33, img10);
    			append_dev(div33, t67);
    			append_dev(div33, div32);
    			append_dev(div32, h49);
    			append_dev(h49, b9);
    			append_dev(div32, t69);
    			append_dev(div32, a13);
    			append_dev(a13, button13);
    			append_dev(div32, t71);
    			append_dev(div32, br6);
    			append_dev(div32, t72);
    			append_dev(div32, a14);
    			append_dev(a14, button14);
    			append_dev(div32, t74);
    			append_dev(div32, br7);
    			append_dev(div32, t75);
    			append_dev(div32, a15);
    			append_dev(a15, button15);
    			append_dev(div96, t77);
    			append_dev(div96, br8);
    			append_dev(div96, t78);
    			append_dev(div96, div45);
    			append_dev(div45, div38);
    			append_dev(div38, div37);
    			append_dev(div37, img11);
    			append_dev(div37, t79);
    			append_dev(div37, div36);
    			append_dev(div36, h410);
    			append_dev(h410, b10);
    			append_dev(div36, t81);
    			append_dev(div36, a16);
    			append_dev(a16, button16);
    			append_dev(div45, t83);
    			append_dev(div45, div41);
    			append_dev(div41, div40);
    			append_dev(div40, img12);
    			append_dev(div40, t84);
    			append_dev(div40, div39);
    			append_dev(div39, h411);
    			append_dev(h411, b11);
    			append_dev(div39, t86);
    			append_dev(div39, a17);
    			append_dev(a17, button17);
    			append_dev(div39, t88);
    			append_dev(div39, br9);
    			append_dev(div39, t89);
    			append_dev(div39, a18);
    			append_dev(a18, button18);
    			append_dev(div39, t91);
    			append_dev(div39, br10);
    			append_dev(div39, t92);
    			append_dev(div39, a19);
    			append_dev(a19, button19);
    			append_dev(div45, t94);
    			append_dev(div45, div44);
    			append_dev(div44, div43);
    			append_dev(div43, img13);
    			append_dev(div43, t95);
    			append_dev(div43, div42);
    			append_dev(div42, h412);
    			append_dev(h412, b12);
    			append_dev(div42, t97);
    			append_dev(div42, a20);
    			append_dev(a20, button20);
    			append_dev(div96, t99);
    			append_dev(div96, br11);
    			append_dev(div96, t100);
    			append_dev(div96, div55);
    			append_dev(div55, div48);
    			append_dev(div48, div47);
    			append_dev(div47, img14);
    			append_dev(div47, t101);
    			append_dev(div47, div46);
    			append_dev(div46, h413);
    			append_dev(h413, b13);
    			append_dev(div46, t103);
    			append_dev(div46, a21);
    			append_dev(a21, button21);
    			append_dev(div46, t105);
    			append_dev(div46, br12);
    			append_dev(div46, t106);
    			append_dev(div46, a22);
    			append_dev(a22, button22);
    			append_dev(div46, t108);
    			append_dev(div46, br13);
    			append_dev(div46, t109);
    			append_dev(div46, a23);
    			append_dev(a23, button23);
    			append_dev(div55, t111);
    			append_dev(div55, div51);
    			append_dev(div51, div50);
    			append_dev(div50, img15);
    			append_dev(div50, t112);
    			append_dev(div50, div49);
    			append_dev(div49, h414);
    			append_dev(h414, b14);
    			append_dev(div49, t114);
    			append_dev(div49, a24);
    			append_dev(a24, button24);
    			append_dev(div55, t116);
    			append_dev(div55, div54);
    			append_dev(div54, div53);
    			append_dev(div53, img16);
    			append_dev(div53, t117);
    			append_dev(div53, div52);
    			append_dev(div52, h415);
    			append_dev(h415, b15);
    			append_dev(div52, t119);
    			append_dev(div52, a25);
    			append_dev(a25, button25);
    			append_dev(div96, t121);
    			append_dev(div96, br14);
    			append_dev(div96, t122);
    			append_dev(div96, div65);
    			append_dev(div65, div58);
    			append_dev(div58, div57);
    			append_dev(div57, img17);
    			append_dev(div57, t123);
    			append_dev(div57, div56);
    			append_dev(div56, h416);
    			append_dev(h416, b16);
    			append_dev(div56, t125);
    			append_dev(div56, a26);
    			append_dev(a26, button26);
    			append_dev(div65, t127);
    			append_dev(div65, div61);
    			append_dev(div61, div60);
    			append_dev(div60, img18);
    			append_dev(div60, t128);
    			append_dev(div60, div59);
    			append_dev(div59, h417);
    			append_dev(h417, b17);
    			append_dev(div59, t130);
    			append_dev(div59, a27);
    			append_dev(a27, button27);
    			append_dev(div65, t132);
    			append_dev(div65, div64);
    			append_dev(div64, div63);
    			append_dev(div63, img19);
    			append_dev(div63, t133);
    			append_dev(div63, div62);
    			append_dev(div62, h418);
    			append_dev(h418, b18);
    			append_dev(div62, t135);
    			append_dev(div62, a28);
    			append_dev(a28, button28);
    			append_dev(div96, t137);
    			append_dev(div96, br15);
    			append_dev(div96, t138);
    			append_dev(div96, div75);
    			append_dev(div75, div68);
    			append_dev(div68, div67);
    			append_dev(div67, img20);
    			append_dev(div67, t139);
    			append_dev(div67, div66);
    			append_dev(div66, h419);
    			append_dev(h419, b19);
    			append_dev(div66, t141);
    			append_dev(div66, a29);
    			append_dev(a29, button29);
    			append_dev(div75, t143);
    			append_dev(div75, div71);
    			append_dev(div71, div70);
    			append_dev(div70, img21);
    			append_dev(div70, t144);
    			append_dev(div70, div69);
    			append_dev(div69, h420);
    			append_dev(h420, b20);
    			append_dev(div69, t146);
    			append_dev(div69, a30);
    			append_dev(a30, button30);
    			append_dev(div75, t148);
    			append_dev(div75, div74);
    			append_dev(div74, div73);
    			append_dev(div73, img22);
    			append_dev(div73, t149);
    			append_dev(div73, div72);
    			append_dev(div72, h421);
    			append_dev(h421, b21);
    			append_dev(div72, t151);
    			append_dev(div72, a31);
    			append_dev(a31, button31);
    			append_dev(div96, t153);
    			append_dev(div96, br16);
    			append_dev(div96, t154);
    			append_dev(div96, div85);
    			append_dev(div85, div78);
    			append_dev(div78, div77);
    			append_dev(div77, img23);
    			append_dev(div77, t155);
    			append_dev(div77, div76);
    			append_dev(div76, h422);
    			append_dev(h422, b22);
    			append_dev(div76, t157);
    			append_dev(div76, a32);
    			append_dev(a32, button32);
    			append_dev(div85, t159);
    			append_dev(div85, div81);
    			append_dev(div81, div80);
    			append_dev(div80, img24);
    			append_dev(div80, t160);
    			append_dev(div80, div79);
    			append_dev(div79, h423);
    			append_dev(h423, b23);
    			append_dev(div79, t162);
    			append_dev(div79, a33);
    			append_dev(a33, button33);
    			append_dev(div85, t164);
    			append_dev(div85, div84);
    			append_dev(div84, div83);
    			append_dev(div83, img25);
    			append_dev(div83, t165);
    			append_dev(div83, div82);
    			append_dev(div82, h424);
    			append_dev(h424, b24);
    			append_dev(div82, t167);
    			append_dev(div82, a34);
    			append_dev(a34, button34);
    			append_dev(div96, t169);
    			append_dev(div96, br17);
    			append_dev(div96, t170);
    			append_dev(div96, div95);
    			append_dev(div95, div88);
    			append_dev(div88, div87);
    			append_dev(div87, div86);
    			append_dev(div86, h425);
    			append_dev(h425, b25);
    			append_dev(div86, t172);
    			append_dev(div86, a35);
    			append_dev(a35, button35);
    			append_dev(div95, t174);
    			append_dev(div95, div91);
    			append_dev(div91, div90);
    			append_dev(div90, div89);
    			append_dev(div89, h426);
    			append_dev(h426, b26);
    			append_dev(div89, t176);
    			append_dev(div89, a36);
    			append_dev(a36, button36);
    			append_dev(div95, t178);
    			append_dev(div95, div94);
    			append_dev(div94, div93);
    			append_dev(div93, div92);
    			append_dev(div92, h427);
    			append_dev(h427, b27);
    			append_dev(div92, t180);
    			append_dev(div92, a37);
    			append_dev(a37, button37);
    			append_dev(div96, t182);
    			append_dev(div96, br18);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$B.name
    		});
    	}
    }

    function toClassName(value) {
      let result = '';

      if (typeof value === 'string' || typeof value === 'number') {
        result += value;
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          result = value.map(toClassName).filter(Boolean).join(' ');
        } else {
          for (let key in value) {
            if (value[key]) {
              result && (result += ' ');
              result += key;
            }
          }
        }
      }

      return result;
    }

    function classnames(...args) {
      return args.map(toClassName).filter(Boolean).join(' ');
    }

    /* node_modules\sveltestrap\src\Colgroup.svelte generated by Svelte v3.47.0 */
    const file$A = "node_modules\\sveltestrap\\src\\Colgroup.svelte";

    function create_fragment$A(ctx) {
    	let colgroup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			colgroup = element("colgroup");
    			if (default_slot) default_slot.c();
    			add_location(colgroup, file$A, 6, 0, 92);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, colgroup, anchor);

    			if (default_slot) {
    				default_slot.m(colgroup, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(colgroup);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Colgroup', slots, ['default']);
    	setContext('colgroup', true);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Colgroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$scope, slots];
    }

    class Colgroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Colgroup",
    			options,
    			id: create_fragment$A.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\ResponsiveContainer.svelte generated by Svelte v3.47.0 */
    const file$z = "node_modules\\sveltestrap\\src\\ResponsiveContainer.svelte";

    // (15:0) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(15:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (13:0) {#if responsive}
    function create_if_block$2(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			add_location(div, file$z, 13, 2, 305);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*responsiveClassName*/ 2) {
    				attr_dev(div, "class", /*responsiveClassName*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(13:0) {#if responsive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$z(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*responsive*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	let responsiveClassName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ResponsiveContainer', slots, ['default']);
    	let className = '';
    	let { responsive = false } = $$props;
    	const writable_props = ['responsive'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ResponsiveContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		responsive,
    		responsiveClassName
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$props.responsive);
    		if ('responsiveClassName' in $$props) $$invalidate(1, responsiveClassName = $$props.responsiveClassName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*responsive*/ 1) {
    			$$invalidate(1, responsiveClassName = classnames(className, {
    				'table-responsive': responsive === true,
    				[`table-responsive-${responsive}`]: typeof responsive === 'string'
    			}));
    		}
    	};

    	return [responsive, responsiveClassName, $$scope, slots];
    }

    class ResponsiveContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { responsive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ResponsiveContainer",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get responsive() {
    		throw new Error("<ResponsiveContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<ResponsiveContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\TableFooter.svelte generated by Svelte v3.47.0 */
    const file$y = "node_modules\\sveltestrap\\src\\TableFooter.svelte";

    function create_fragment$y(ctx) {
    	let tfoot;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let tfoot_levels = [/*$$restProps*/ ctx[0]];
    	let tfoot_data = {};

    	for (let i = 0; i < tfoot_levels.length; i += 1) {
    		tfoot_data = assign(tfoot_data, tfoot_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			tfoot = element("tfoot");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$y, 7, 2, 117);
    			set_attributes(tfoot, tfoot_data);
    			add_location(tfoot, file$y, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tfoot, anchor);
    			append_dev(tfoot, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(tfoot, tfoot_data = get_spread_update(tfoot_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tfoot);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableFooter', slots, ['default']);
    	setContext('footer', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableFooter",
    			options,
    			id: create_fragment$y.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\TableHeader.svelte generated by Svelte v3.47.0 */
    const file$x = "node_modules\\sveltestrap\\src\\TableHeader.svelte";

    function create_fragment$x(ctx) {
    	let thead;
    	let tr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);
    	let thead_levels = [/*$$restProps*/ ctx[0]];
    	let thead_data = {};

    	for (let i = 0; i < thead_levels.length; i += 1) {
    		thead_data = assign(thead_data, thead_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			add_location(tr, file$x, 7, 2, 117);
    			set_attributes(thead, thead_data);
    			add_location(thead, file$x, 6, 0, 90);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(thead, thead_data = get_spread_update(thead_levels, [dirty & /*$$restProps*/ 1 && /*$$restProps*/ ctx[0]]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableHeader', slots, ['default']);
    	setContext('header', true);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('$$scope' in $$new_props) $$invalidate(1, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ setContext });
    	return [$$restProps, $$scope, slots];
    }

    class TableHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableHeader",
    			options,
    			id: create_fragment$x.name
    		});
    	}
    }

    /* node_modules\sveltestrap\src\Table.svelte generated by Svelte v3.47.0 */
    const file$w = "node_modules\\sveltestrap\\src\\Table.svelte";

    function get_each_context$s(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes_1 = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context_1 = ctx => ({ row: /*row*/ ctx[13] });
    const get_default_slot_changes = dirty => ({ row: dirty & /*rows*/ 2 });
    const get_default_slot_context = ctx => ({ row: /*row*/ ctx[13] });

    // (50:4) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (33:4) {#if rows}
    function create_if_block$1(ctx) {
    	let colgroup;
    	let t0;
    	let tableheader;
    	let t1;
    	let tbody;
    	let t2;
    	let tablefooter;
    	let current;

    	colgroup = new Colgroup({
    			props: {
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tableheader = new TableHeader({
    			props: {
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*rows*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$s(get_each_context$s(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	tablefooter = new TableFooter({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(colgroup.$$.fragment);
    			t0 = space();
    			create_component(tableheader.$$.fragment);
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			create_component(tablefooter.$$.fragment);
    			add_location(tbody, file$w, 39, 6, 1057);
    		},
    		m: function mount(target, anchor) {
    			mount_component(colgroup, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(tableheader, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, tbody, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(tablefooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const colgroup_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				colgroup_changes.$$scope = { dirty, ctx };
    			}

    			colgroup.$set(colgroup_changes);
    			const tableheader_changes = {};

    			if (dirty & /*$$scope, rows*/ 4098) {
    				tableheader_changes.$$scope = { dirty, ctx };
    			}

    			tableheader.$set(tableheader_changes);

    			if (dirty & /*$$scope, rows*/ 4098) {
    				each_value = /*rows*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$s(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$s(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const tablefooter_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				tablefooter_changes.$$scope = { dirty, ctx };
    			}

    			tablefooter.$set(tablefooter_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(colgroup.$$.fragment, local);
    			transition_in(tableheader.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(tablefooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(colgroup.$$.fragment, local);
    			transition_out(tableheader.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(tablefooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(colgroup, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(tableheader, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(tablefooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(33:4) {#if rows}",
    		ctx
    	});

    	return block;
    }

    // (34:6) <Colgroup>
    function create_default_slot_3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(34:6) <Colgroup>",
    		ctx
    	});

    	return block;
    }

    // (37:6) <TableHeader>
    function create_default_slot_2$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(37:6) <TableHeader>",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each rows as row}
    function create_each_block$s(ctx) {
    	let tr;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context_1);

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (default_slot) default_slot.c();
    			t = space();
    			add_location(tr, file$w, 41, 10, 1103);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (default_slot) {
    				default_slot.m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, rows*/ 4098)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, get_default_slot_changes_1),
    						get_default_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$s.name,
    		type: "each",
    		source: "(41:8) {#each rows as row}",
    		ctx
    	});

    	return block;
    }

    // (47:6) <TableFooter>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(47:6) <TableFooter>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <ResponsiveContainer {responsive}>
    function create_default_slot$s(ctx) {
    	let table;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*rows*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let table_levels = [/*$$restProps*/ ctx[3], { class: /*classes*/ ctx[2] }];
    	let table_data = {};

    	for (let i = 0; i < table_levels.length; i += 1) {
    		table_data = assign(table_data, table_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			table = element("table");
    			if_block.c();
    			set_attributes(table, table_data);
    			add_location(table, file$w, 31, 2, 885);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if_blocks[current_block_type_index].m(table, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(table, null);
    			}

    			set_attributes(table, table_data = get_spread_update(table_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				(!current || dirty & /*classes*/ 4) && { class: /*classes*/ ctx[2] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$s.name,
    		type: "slot",
    		source: "(31:0) <ResponsiveContainer {responsive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let responsivecontainer;
    	let current;

    	responsivecontainer = new ResponsiveContainer({
    			props: {
    				responsive: /*responsive*/ ctx[0],
    				$$slots: { default: [create_default_slot$s] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(responsivecontainer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(responsivecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const responsivecontainer_changes = {};
    			if (dirty & /*responsive*/ 1) responsivecontainer_changes.responsive = /*responsive*/ ctx[0];

    			if (dirty & /*$$scope, $$restProps, classes, rows*/ 4110) {
    				responsivecontainer_changes.$$scope = { dirty, ctx };
    			}

    			responsivecontainer.$set(responsivecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(responsivecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(responsivecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(responsivecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	let classes;

    	const omit_props_names = [
    		"class","size","bordered","borderless","striped","dark","hover","responsive","rows"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { size = '' } = $$props;
    	let { bordered = false } = $$props;
    	let { borderless = false } = $$props;
    	let { striped = false } = $$props;
    	let { dark = false } = $$props;
    	let { hover = false } = $$props;
    	let { responsive = false } = $$props;
    	let { rows = undefined } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('size' in $$new_props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$new_props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$new_props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$new_props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$new_props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$new_props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$new_props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$new_props) $$invalidate(1, rows = $$new_props.rows);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		Colgroup,
    		ResponsiveContainer,
    		TableFooter,
    		TableHeader,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		responsive,
    		rows,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('size' in $$props) $$invalidate(5, size = $$new_props.size);
    		if ('bordered' in $$props) $$invalidate(6, bordered = $$new_props.bordered);
    		if ('borderless' in $$props) $$invalidate(7, borderless = $$new_props.borderless);
    		if ('striped' in $$props) $$invalidate(8, striped = $$new_props.striped);
    		if ('dark' in $$props) $$invalidate(9, dark = $$new_props.dark);
    		if ('hover' in $$props) $$invalidate(10, hover = $$new_props.hover);
    		if ('responsive' in $$props) $$invalidate(0, responsive = $$new_props.responsive);
    		if ('rows' in $$props) $$invalidate(1, rows = $$new_props.rows);
    		if ('classes' in $$props) $$invalidate(2, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className, size, bordered, borderless, striped, dark, hover*/ 2032) {
    			$$invalidate(2, classes = classnames(className, 'table', size ? 'table-' + size : false, bordered ? 'table-bordered' : false, borderless ? 'table-borderless' : false, striped ? 'table-striped' : false, dark ? 'table-dark' : false, hover ? 'table-hover' : false));
    		}
    	};

    	return [
    		responsive,
    		rows,
    		classes,
    		$$restProps,
    		className,
    		size,
    		bordered,
    		borderless,
    		striped,
    		dark,
    		hover,
    		slots,
    		$$scope
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			class: 4,
    			size: 5,
    			bordered: 6,
    			borderless: 7,
    			striped: 8,
    			dark: 9,
    			hover: 10,
    			responsive: 0,
    			rows: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get class() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bordered() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bordered(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderless() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderless(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get striped() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set striped(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dark() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dark(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hover() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hover(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get responsive() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set responsive(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\sveltestrap\src\Button.svelte generated by Svelte v3.47.0 */
    const file$v = "node_modules\\sveltestrap\\src\\Button.svelte";

    // (54:0) {:else}
    function create_else_block_1(ctx) {
    	let button;
    	let button_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ value: /*value*/ ctx[5] },
    		{
    			"aria-label": button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(button, button_data);
    			add_location(button, file$v, 54, 2, 1124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[23](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*children, $$scope*/ 262146)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*value*/ 32) && { value: /*value*/ ctx[5] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && button_aria_label_value !== (button_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": button_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*button_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (37:0) {#if href}
    function create_if_block(ctx) {
    	let a;
    	let current_block_type_index;
    	let if_block;
    	let a_aria_label_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	let a_levels = [
    		/*$$restProps*/ ctx[9],
    		{ class: /*classes*/ ctx[7] },
    		{ disabled: /*disabled*/ ctx[2] },
    		{ href: /*href*/ ctx[3] },
    		{
    			"aria-label": a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6]
    		},
    		{ style: /*style*/ ctx[4] }
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if_block.c();
    			set_attributes(a, a_data);
    			add_location(a, file$v, 37, 2, 866);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			if_blocks[current_block_type_index].m(a, null);
    			/*a_binding*/ ctx[22](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(a, null);
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$restProps*/ 512 && /*$$restProps*/ ctx[9],
    				(!current || dirty & /*classes*/ 128) && { class: /*classes*/ ctx[7] },
    				(!current || dirty & /*disabled*/ 4) && { disabled: /*disabled*/ ctx[2] },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*ariaLabel, defaultAriaLabel*/ 320 && a_aria_label_value !== (a_aria_label_value = /*ariaLabel*/ ctx[8] || /*defaultAriaLabel*/ ctx[6])) && { "aria-label": a_aria_label_value },
    				(!current || dirty & /*style*/ 16) && { style: /*style*/ ctx[4] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if_blocks[current_block_type_index].d();
    			/*a_binding*/ ctx[22](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block.name,
    		type: "if",
    		source: "(37:0) {#if href}",
    		ctx
    	});

    	return block_1;
    }

    // (68:6) {:else}
    function create_else_block_2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(68:6) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (66:6) {#if children}
    function create_if_block_2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(66:6) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    // (65:10)        
    function fallback_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*children*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(65:10)        ",
    		ctx
    	});

    	return block_1;
    }

    // (50:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block_1 = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block.name,
    		type: "else",
    		source: "(50:4) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (48:4) {#if children}
    function create_if_block_1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text(/*children*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*children*/ 2) set_data_dev(t, /*children*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(48:4) {#if children}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$v(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let ariaLabel;
    	let classes;
    	let defaultAriaLabel;

    	const omit_props_names = [
    		"class","active","block","children","close","color","disabled","href","inner","outline","size","style","value","white"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { class: className = '' } = $$props;
    	let { active = false } = $$props;
    	let { block = false } = $$props;
    	let { children = undefined } = $$props;
    	let { close = false } = $$props;
    	let { color = 'secondary' } = $$props;
    	let { disabled = false } = $$props;
    	let { href = '' } = $$props;
    	let { inner = undefined } = $$props;
    	let { outline = false } = $$props;
    	let { size = null } = $$props;
    	let { style = '' } = $$props;
    	let { value = '' } = $$props;
    	let { white = false } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inner = $$value;
    			$$invalidate(0, inner);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$new_props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$new_props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$new_props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$new_props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$new_props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$new_props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$new_props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$new_props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$new_props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$new_props) $$invalidate(17, white = $$new_props.white);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		classnames,
    		className,
    		active,
    		block,
    		children,
    		close,
    		color,
    		disabled,
    		href,
    		inner,
    		outline,
    		size,
    		style,
    		value,
    		white,
    		defaultAriaLabel,
    		classes,
    		ariaLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(24, $$props = assign(assign({}, $$props), $$new_props));
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('block' in $$props) $$invalidate(12, block = $$new_props.block);
    		if ('children' in $$props) $$invalidate(1, children = $$new_props.children);
    		if ('close' in $$props) $$invalidate(13, close = $$new_props.close);
    		if ('color' in $$props) $$invalidate(14, color = $$new_props.color);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('inner' in $$props) $$invalidate(0, inner = $$new_props.inner);
    		if ('outline' in $$props) $$invalidate(15, outline = $$new_props.outline);
    		if ('size' in $$props) $$invalidate(16, size = $$new_props.size);
    		if ('style' in $$props) $$invalidate(4, style = $$new_props.style);
    		if ('value' in $$props) $$invalidate(5, value = $$new_props.value);
    		if ('white' in $$props) $$invalidate(17, white = $$new_props.white);
    		if ('defaultAriaLabel' in $$props) $$invalidate(6, defaultAriaLabel = $$new_props.defaultAriaLabel);
    		if ('classes' in $$props) $$invalidate(7, classes = $$new_props.classes);
    		if ('ariaLabel' in $$props) $$invalidate(8, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(8, ariaLabel = $$props['aria-label']);

    		if ($$self.$$.dirty & /*className, close, outline, color, size, block, active, white*/ 261120) {
    			$$invalidate(7, classes = classnames(className, close ? 'btn-close' : 'btn', close || `btn${outline ? '-outline' : ''}-${color}`, size ? `btn-${size}` : false, block ? 'd-block w-100' : false, {
    				active,
    				'btn-close-white': close && white
    			}));
    		}

    		if ($$self.$$.dirty & /*close*/ 8192) {
    			$$invalidate(6, defaultAriaLabel = close ? 'Close' : null);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		inner,
    		children,
    		disabled,
    		href,
    		style,
    		value,
    		defaultAriaLabel,
    		classes,
    		ariaLabel,
    		$$restProps,
    		className,
    		active,
    		block,
    		close,
    		color,
    		outline,
    		size,
    		white,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		a_binding,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			class: 10,
    			active: 11,
    			block: 12,
    			children: 1,
    			close: 13,
    			color: 14,
    			disabled: 2,
    			href: 3,
    			inner: 0,
    			outline: 15,
    			size: 16,
    			style: 4,
    			value: 5,
    			white: 17
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get children() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set children(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set close(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inner() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inner(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get white() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set white(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\front\streamers\list.svelte generated by Svelte v3.47.0 */

    const { console: console_1$r } = globals;
    const file$u = "src\\front\\streamers\\list.svelte";

    function get_each_context$r(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$r(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$r.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (42:1) {:then entries}
    function create_then_block$r(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$r] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 65) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$r.name,
    		type: "then",
    		source: "(42:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (59:3) {#each entries as entry}
    function create_each_block$r(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[3].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[3].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[3].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[3].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$u, 60, 5, 1109);
    			add_location(td1, file$u, 61, 5, 1137);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$u, 62, 102, 1265);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[3].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$u, 62, 9, 1172);
    			add_location(td2, file$u, 62, 5, 1168);
    			add_location(td3, file$u, 63, 5, 1353);
    			add_location(td4, file$u, 64, 5, 1386);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[3].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$u, 67, 6, 1451);
    			add_location(td5, file$u, 66, 20, 1440);
    			add_location(tr, file$u, 59, 4, 1099);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[3].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[3].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[3].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[3].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[3].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[3].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$r.name,
    		type: "each",
    		source: "(59:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (43:1) <Table bordered>
    function create_default_slot$r(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$r(get_each_context$r(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$u, 47, 4, 889);
    			add_location(th1, file$u, 48, 4, 909);
    			add_location(th2, file$u, 49, 4, 931);
    			add_location(th3, file$u, 50, 4, 954);
    			add_location(th4, file$u, 51, 4, 983);
    			add_location(th5, file$u, 52, 4, 1002);
    			add_location(tr0, file$u, 46, 3, 880);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$u, 45, 2, 854);
    			add_location(tr1, file$u, 56, 3, 1051);
    			add_location(tbody, file$u, 55, 2, 1040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$r(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$r(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$r.name,
    		type: "slot",
    		source: "(43:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (40:16)  loading  {:then entries}
    function create_pending_block$r(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$r.name,
    		type: "pending",
    		source: "(40:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$r,
    		then: create_then_block$r,
    		catch: create_catch_block$r,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Th3Antonio";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$u, 35, 4, 726);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$u, 34, 2, 690);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$u, 33, 1, 659);
    			add_location(main, file$u, 31, 0, 650);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	let entries = [];

    	let newEntry = {
    		country: "",
    		year: "",
    		most_grand_slam: "",
    		masters_finals: "",
    		olympic_gold_medals: ""
    	};

    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/th3antonio");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$r.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		newEntry,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    		if ('newEntry' in $$props) newEntry = $$props.newEntry;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$u.name
    		});
    	}
    }

    /* src\front\streamers\league.svelte generated by Svelte v3.47.0 */

    const { console: console_1$q } = globals;
    const file$t = "src\\front\\streamers\\league.svelte";

    function get_each_context$q(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$q(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$q.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$q(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$q] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$q.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$q(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$t, 52, 5, 993);
    			add_location(td1, file$t, 53, 5, 1021);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$t, 54, 102, 1149);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$t, 54, 9, 1056);
    			add_location(td2, file$t, 54, 5, 1052);
    			add_location(td3, file$t, 55, 5, 1237);
    			add_location(td4, file$t, 56, 5, 1270);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$t, 59, 6, 1335);
    			add_location(td5, file$t, 58, 20, 1324);
    			add_location(tr, file$t, 51, 4, 983);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$q.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$q(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$q(get_each_context$q(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$t, 39, 4, 773);
    			add_location(th1, file$t, 40, 4, 793);
    			add_location(th2, file$t, 41, 4, 815);
    			add_location(th3, file$t, 42, 4, 838);
    			add_location(th4, file$t, 43, 4, 867);
    			add_location(th5, file$t, 44, 4, 886);
    			add_location(tr0, file$t, 38, 3, 764);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$t, 37, 2, 738);
    			add_location(tr1, file$t, 48, 3, 935);
    			add_location(tbody, file$t, 47, 2, 924);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$q(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$q(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$q.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$q(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$q.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$q,
    		then: create_then_block$q,
    		catch: create_catch_block$q,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Categoria: LeagueOfLegends";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$t, 26, 4, 601);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$t, 25, 2, 565);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$t, 24, 1, 534);
    			add_location(main, file$t, 22, 0, 525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('League', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/leagueoflegends/es");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$q.warn(`<League> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class League extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "League",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\front\streamers\ojoninja.svelte generated by Svelte v3.47.0 */

    const { console: console_1$p } = globals;
    const file$s = "src\\front\\streamers\\ojoninja.svelte";

    function get_each_context$p(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$p(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$p.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$p(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$p] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$p.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$p(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$s, 52, 5, 979);
    			add_location(td1, file$s, 53, 5, 1007);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$s, 54, 102, 1135);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$s, 54, 9, 1042);
    			add_location(td2, file$s, 54, 5, 1038);
    			add_location(td3, file$s, 55, 5, 1223);
    			add_location(td4, file$s, 56, 5, 1256);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$s, 59, 6, 1321);
    			add_location(td5, file$s, 58, 20, 1310);
    			add_location(tr, file$s, 51, 4, 969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$p.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$p(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$p(get_each_context$p(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$s, 39, 4, 759);
    			add_location(th1, file$s, 40, 4, 779);
    			add_location(th2, file$s, 41, 4, 801);
    			add_location(th3, file$s, 42, 4, 824);
    			add_location(th4, file$s, 43, 4, 853);
    			add_location(th5, file$s, 44, 4, 872);
    			add_location(tr0, file$s, 38, 3, 750);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$s, 37, 2, 724);
    			add_location(tr1, file$s, 48, 3, 921);
    			add_location(tbody, file$s, 47, 2, 910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$p(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$p(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$p.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$p(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$p.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$s(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$p,
    		then: create_then_block$p,
    		catch: create_catch_block$p,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: ElOjoNinja";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$s, 26, 4, 593);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$s, 25, 2, 557);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$s, 24, 1, 526);
    			add_location(main, file$s, 22, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ojoninja', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/elojoninja");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$p.warn(`<Ojoninja> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Ojoninja extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ojoninja",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\front\streamers\elyoya.svelte generated by Svelte v3.47.0 */

    const { console: console_1$o } = globals;
    const file$r = "src\\front\\streamers\\elyoya.svelte";

    function get_each_context$o(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$o(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$o.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$o(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$o] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$o.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$o(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$r, 52, 5, 971);
    			add_location(td1, file$r, 53, 5, 999);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$r, 54, 102, 1127);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$r, 54, 9, 1034);
    			add_location(td2, file$r, 54, 5, 1030);
    			add_location(td3, file$r, 55, 5, 1215);
    			add_location(td4, file$r, 56, 5, 1248);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$r, 59, 6, 1313);
    			add_location(td5, file$r, 58, 20, 1302);
    			add_location(tr, file$r, 51, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$o.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$o(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$o(get_each_context$o(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$r, 39, 4, 751);
    			add_location(th1, file$r, 40, 4, 771);
    			add_location(th2, file$r, 41, 4, 793);
    			add_location(th3, file$r, 42, 4, 816);
    			add_location(th4, file$r, 43, 4, 845);
    			add_location(th5, file$r, 44, 4, 864);
    			add_location(tr0, file$r, 38, 3, 742);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$r, 37, 2, 716);
    			add_location(tr1, file$r, 48, 3, 913);
    			add_location(tbody, file$r, 47, 2, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$o(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$o(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$o.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$o(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$o.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$o,
    		then: create_then_block$o,
    		catch: create_catch_block$o,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: ElYoya";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$r, 26, 4, 589);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$r, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$r, 24, 1, 522);
    			add_location(main, file$r, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Elyoya', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/elyoya");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$o.warn(`<Elyoya> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Elyoya extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Elyoya",
    			options,
    			id: create_fragment$r.name
    		});
    	}
    }

    /* src\front\streamers\werlyb.svelte generated by Svelte v3.47.0 */

    const { console: console_1$n } = globals;
    const file$q = "src\\front\\streamers\\werlyb.svelte";

    function get_each_context$n(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$n(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$n.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$n(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$n] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$n.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$n(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$q, 52, 5, 971);
    			add_location(td1, file$q, 53, 5, 999);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$q, 54, 102, 1127);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$q, 54, 9, 1034);
    			add_location(td2, file$q, 54, 5, 1030);
    			add_location(td3, file$q, 55, 5, 1215);
    			add_location(td4, file$q, 56, 5, 1248);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$q, 59, 6, 1313);
    			add_location(td5, file$q, 58, 20, 1302);
    			add_location(tr, file$q, 51, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$n.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$n(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$n(get_each_context$n(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$q, 39, 4, 751);
    			add_location(th1, file$q, 40, 4, 771);
    			add_location(th2, file$q, 41, 4, 793);
    			add_location(th3, file$q, 42, 4, 816);
    			add_location(th4, file$q, 43, 4, 845);
    			add_location(th5, file$q, 44, 4, 864);
    			add_location(tr0, file$q, 38, 3, 742);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$q, 37, 2, 716);
    			add_location(tr1, file$q, 48, 3, 913);
    			add_location(tbody, file$q, 47, 2, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$n(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$n(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$n.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$n(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$n.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$n,
    		then: create_then_block$n,
    		catch: create_catch_block$n,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Werlyb";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$q, 26, 4, 589);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$q, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$q, 24, 1, 522);
    			add_location(main, file$q, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Werlyb', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/werlyb");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$n.warn(`<Werlyb> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Werlyb extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Werlyb",
    			options,
    			id: create_fragment$q.name
    		});
    	}
    }

    /* src\front\streamers\koldo.svelte generated by Svelte v3.47.0 */

    const { console: console_1$m } = globals;
    const file$p = "src\\front\\streamers\\koldo.svelte";

    function get_each_context$m(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$m(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$m.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$m(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$m] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$m.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$m(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$p, 52, 5, 969);
    			add_location(td1, file$p, 53, 5, 997);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$p, 54, 102, 1125);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$p, 54, 9, 1032);
    			add_location(td2, file$p, 54, 5, 1028);
    			add_location(td3, file$p, 55, 5, 1213);
    			add_location(td4, file$p, 56, 5, 1246);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$p, 59, 6, 1311);
    			add_location(td5, file$p, 58, 20, 1300);
    			add_location(tr, file$p, 51, 4, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$m.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$m(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$m(get_each_context$m(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$p, 39, 4, 749);
    			add_location(th1, file$p, 40, 4, 769);
    			add_location(th2, file$p, 41, 4, 791);
    			add_location(th3, file$p, 42, 4, 814);
    			add_location(th4, file$p, 43, 4, 843);
    			add_location(th5, file$p, 44, 4, 862);
    			add_location(tr0, file$p, 38, 3, 740);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$p, 37, 2, 714);
    			add_location(tr1, file$p, 48, 3, 911);
    			add_location(tbody, file$p, 47, 2, 900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$m(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$m(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$m.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$m(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$m.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$m,
    		then: create_then_block$m,
    		catch: create_catch_block$m,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Koldo";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$p, 26, 4, 588);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$p, 25, 2, 552);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$p, 24, 1, 521);
    			add_location(main, file$p, 22, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Koldo', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/koldo");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$m.warn(`<Koldo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Koldo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Koldo",
    			options,
    			id: create_fragment$p.name
    		});
    	}
    }

    /* src\front\streamers\skain.svelte generated by Svelte v3.47.0 */

    const { console: console_1$l } = globals;
    const file$o = "src\\front\\streamers\\skain.svelte";

    function get_each_context$l(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$l(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$l.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block$l(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$l] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$l.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block$l(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$o, 53, 5, 994);
    			add_location(td1, file$o, 54, 5, 1022);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$o, 55, 102, 1150);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$o, 55, 9, 1057);
    			add_location(td2, file$o, 55, 5, 1053);
    			add_location(td3, file$o, 56, 5, 1238);
    			add_location(td4, file$o, 57, 5, 1271);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$o, 60, 6, 1336);
    			add_location(td5, file$o, 59, 20, 1325);
    			add_location(tr, file$o, 52, 4, 984);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$l.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot$l(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$l(get_each_context$l(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$o, 40, 4, 774);
    			add_location(th1, file$o, 41, 4, 794);
    			add_location(th2, file$o, 42, 4, 816);
    			add_location(th3, file$o, 43, 4, 839);
    			add_location(th4, file$o, 44, 4, 868);
    			add_location(th5, file$o, 45, 4, 887);
    			add_location(tr0, file$o, 39, 3, 765);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$o, 38, 2, 739);
    			add_location(tr1, file$o, 49, 3, 936);
    			add_location(tbody, file$o, 48, 2, 925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$l(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$l(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$l.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block$l(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$l.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$l,
    		then: create_then_block$l,
    		catch: create_catch_block$l,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Skain";
    			t1 = space();
    			title = element("title");
    			title.textContent = "Skain";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$o, 26, 4, 588);
    			add_location(title, file$o, 27, 4, 617);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$o, 25, 2, 552);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$o, 24, 1, 521);
    			add_location(main, file$o, 22, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skain', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/skain");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$l.warn(`<Skain> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Skain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skain",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\front\streamers\nissaxter.svelte generated by Svelte v3.47.0 */

    const { console: console_1$k } = globals;
    const file$n = "src\\front\\streamers\\nissaxter.svelte";

    function get_each_context$k(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$k(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$k.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$k(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$k] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$k.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$k(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$n, 52, 5, 977);
    			add_location(td1, file$n, 53, 5, 1005);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$n, 54, 102, 1133);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$n, 54, 9, 1040);
    			add_location(td2, file$n, 54, 5, 1036);
    			add_location(td3, file$n, 55, 5, 1221);
    			add_location(td4, file$n, 56, 5, 1254);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "562");
    			attr_dev(iframe, "width", "1000");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$n, 59, 6, 1319);
    			add_location(td5, file$n, 58, 20, 1308);
    			add_location(tr, file$n, 51, 4, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$k.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$k(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$k(get_each_context$k(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$n, 39, 4, 757);
    			add_location(th1, file$n, 40, 4, 777);
    			add_location(th2, file$n, 41, 4, 799);
    			add_location(th3, file$n, 42, 4, 822);
    			add_location(th4, file$n, 43, 4, 851);
    			add_location(th5, file$n, 44, 4, 870);
    			add_location(tr0, file$n, 38, 3, 748);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$n, 37, 2, 722);
    			add_location(tr1, file$n, 48, 3, 919);
    			add_location(tbody, file$n, 47, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$k(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$k(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$k.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$k(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$k.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$k,
    		then: create_then_block$k,
    		catch: create_catch_block$k,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Nissaxter";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$n, 26, 4, 592);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$n, 25, 2, 556);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$n, 24, 1, 525);
    			add_location(main, file$n, 22, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Nissaxter', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/nissaxter");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$k.warn(`<Nissaxter> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Nissaxter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nissaxter",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\front\streamers\pochipoom.svelte generated by Svelte v3.47.0 */

    const { console: console_1$j } = globals;
    const file$m = "src\\front\\streamers\\pochipoom.svelte";

    function get_each_context$j(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$j(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$j.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$j(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$j] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$j.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$j(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$m, 52, 5, 977);
    			add_location(td1, file$m, 53, 5, 1005);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$m, 54, 102, 1133);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$m, 54, 9, 1040);
    			add_location(td2, file$m, 54, 5, 1036);
    			add_location(td3, file$m, 55, 5, 1221);
    			add_location(td4, file$m, 56, 5, 1254);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$m, 59, 6, 1319);
    			add_location(td5, file$m, 58, 20, 1308);
    			add_location(tr, file$m, 51, 4, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$j.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$j(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$j(get_each_context$j(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$m, 39, 4, 757);
    			add_location(th1, file$m, 40, 4, 777);
    			add_location(th2, file$m, 41, 4, 799);
    			add_location(th3, file$m, 42, 4, 822);
    			add_location(th4, file$m, 43, 4, 851);
    			add_location(th5, file$m, 44, 4, 870);
    			add_location(tr0, file$m, 38, 3, 748);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$m, 37, 2, 722);
    			add_location(tr1, file$m, 48, 3, 919);
    			add_location(tbody, file$m, 47, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$j(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$j(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$j.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$j(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$j.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$j,
    		then: create_then_block$j,
    		catch: create_catch_block$j,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Pochipoom";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$m, 26, 4, 592);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$m, 25, 2, 556);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$m, 24, 1, 525);
    			add_location(main, file$m, 22, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pochipoom', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/pochipoom");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$j.warn(`<Pochipoom> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Pochipoom extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pochipoom",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    /* src\front\streamers\ffaka.svelte generated by Svelte v3.47.0 */

    const { console: console_1$i } = globals;
    const file$l = "src\\front\\streamers\\ffaka.svelte";

    function get_each_context$i(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$i(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$i.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$i(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$i] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$i.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$i(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$l, 52, 5, 969);
    			add_location(td1, file$l, 53, 5, 997);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$l, 54, 102, 1125);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$l, 54, 9, 1032);
    			add_location(td2, file$l, 54, 5, 1028);
    			add_location(td3, file$l, 55, 5, 1213);
    			add_location(td4, file$l, 56, 5, 1246);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$l, 59, 6, 1311);
    			add_location(td5, file$l, 58, 20, 1300);
    			add_location(tr, file$l, 51, 4, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$i.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$i(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$i(get_each_context$i(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$l, 39, 4, 749);
    			add_location(th1, file$l, 40, 4, 769);
    			add_location(th2, file$l, 41, 4, 791);
    			add_location(th3, file$l, 42, 4, 814);
    			add_location(th4, file$l, 43, 4, 843);
    			add_location(th5, file$l, 44, 4, 862);
    			add_location(tr0, file$l, 38, 3, 740);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$l, 37, 2, 714);
    			add_location(tr1, file$l, 48, 3, 911);
    			add_location(tbody, file$l, 47, 2, 900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$i(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$i(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$i.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$i(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$i.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$i,
    		then: create_then_block$i,
    		catch: create_catch_block$i,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Ffaka";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$l, 26, 4, 588);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$l, 25, 2, 552);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$l, 24, 1, 521);
    			add_location(main, file$l, 22, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ffaka', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/ffaka");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$i.warn(`<Ffaka> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Ffaka extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ffaka",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\front\streamers\carmensandwich.svelte generated by Svelte v3.47.0 */

    const { console: console_1$h } = globals;
    const file$k = "src\\front\\streamers\\carmensandwich.svelte";

    function get_each_context$h(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$h(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$h.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (76:1) {:then entries}
    function create_then_block$h(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 4194308) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$h.name,
    		type: "then",
    		source: "(76:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (93:3) {#each entries as entry}
    function create_each_block_1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[19].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[19].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[19].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[19].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$k, 94, 5, 1919);
    			add_location(td1, file$k, 95, 5, 1947);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$k, 96, 102, 2075);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[19].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$k, 96, 9, 1982);
    			add_location(td2, file$k, 96, 5, 1978);
    			add_location(td3, file$k, 97, 5, 2163);
    			add_location(td4, file$k, 98, 5, 2196);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[19].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$k, 101, 6, 2261);
    			add_location(td5, file$k, 100, 20, 2250);
    			add_location(tr, file$k, 93, 4, 1909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 4 && t0_value !== (t0_value = /*entry*/ ctx[19].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 4 && t2_value !== (t2_value = /*entry*/ ctx[19].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 4 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[19].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 4 && t6_value !== (t6_value = /*entry*/ ctx[19].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 4 && t8_value !== (t8_value = /*entry*/ ctx[19].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 4 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[19].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(93:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (77:1) <Table bordered>
    function create_default_slot_2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value_1 = /*entries*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$k, 81, 4, 1699);
    			add_location(th1, file$k, 82, 4, 1719);
    			add_location(th2, file$k, 83, 4, 1741);
    			add_location(th3, file$k, 84, 4, 1764);
    			add_location(th4, file$k, 85, 4, 1793);
    			add_location(th5, file$k, 86, 4, 1812);
    			add_location(tr0, file$k, 80, 3, 1690);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$k, 79, 2, 1664);
    			add_location(tr1, file$k, 90, 3, 1861);
    			add_location(tbody, file$k, 89, 2, 1850);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 4) {
    				each_value_1 = /*entries*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(77:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (74:16)  loading  {:then entries}
    function create_pending_block$h(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$h.name,
    		type: "pending",
    		source: "(74:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (119:8) <Button outline color="secondary" on:click={()=>{             offset = page;             getEntries();         }}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*page*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(119:8) <Button outline color=\\\"secondary\\\" on:click={()=>{             offset = page;             getEntries();         }}>",
    		ctx
    	});

    	return block;
    }

    // (117:4) {#each Array(maxPages+1) as _,page}
    function create_each_block$h(ctx) {
    	let button;
    	let t;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*page*/ ctx[4]);
    	}

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    			t = text(" ");
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			insert_dev(target, t, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$h.name,
    		type: "each",
    		source: "(117:4) {#each Array(maxPages+1) as _,page}",
    		ctx
    	});

    	return block;
    }

    // (125:4) <Button outline color="secondary" on:click={()=>{         getEntries();     }}>
    function create_default_slot$h(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Actualizar nº de página");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$h.name,
    		type: "slot",
    		source: "(125:4) <Button outline color=\\\"secondary\\\" on:click={()=>{         getEntries();     }}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let t2;
    	let div;
    	let t3;
    	let button;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$h,
    		then: create_then_block$h,
    		catch: create_catch_block$h,
    		value: 2,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[2], info);
    	let each_value = Array(/*maxPages*/ ctx[1] + 1);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$h(get_each_context$h(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	button = new Button({
    			props: {
    				outline: true,
    				color: "secondary",
    				$$slots: { default: [create_default_slot$h] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[6]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: CarmenSandwich";
    			t1 = space();
    			info.block.c();
    			t2 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			create_component(button.$$.fragment);
    			add_location(h1, file$k, 68, 4, 1529);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$k, 67, 2, 1493);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$k, 66, 1, 1462);
    			attr_dev(div, "align", "center");
    			add_location(div, file$k, 115, 0, 2493);
    			add_location(main, file$k, 64, 0, 1453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = t2;
    			append_dev(main, t2);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t3);
    			mount_component(button, div, null);
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 4 && promise !== (promise = /*entries*/ ctx[2]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}

    			if (dirty & /*offset, getEntries, maxPages*/ 11) {
    				each_value = Array(/*maxPages*/ ctx[1] + 1);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$h(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$h(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t3);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4194304) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    			destroy_each(each_blocks, detaching);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Carmensandwich', slots, []);
    	var BASE_API_PATH = "/api/v2/tennis";
    	let entries = [];
    	let checkMSG = "";
    	let visible = false;
    	let color = "danger";
    	let page = 1;
    	let totaldata = 6;
    	let from = null;
    	let to = null;
    	let offset = 0;
    	let limit = 10;
    	let maxPages = 0;
    	let numEntries;
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		let cadena = `/api/v1/carmensandwich?limit=${limit}&&offset=${offset * 10}&&`;

    		if (from != null) {
    			cadena = cadena + `from=${from}&&`;
    		}

    		if (to != null) {
    			cadena = cadena + `to=${to}&&`;
    		}

    		const res = await fetch(cadena);

    		if (res.ok) {
    			let cadenaPag = cadena.split(`limit=${limit}&&offset=${offset * 10}`);
    			maxPagesFunction(cadenaPag[0] + cadenaPag[1]);
    			const data = await res.json();
    			$$invalidate(2, entries = data);
    			numEntries = entries.length;
    			console.log("Received entries: " + entries.length);
    		} else {
    			Errores(res.status);
    		}
    	}

    	async function maxPagesFunction(cadena) {
    		const res = await fetch(cadena, { method: "GET" });

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(1, maxPages = Math.floor(data.length / 10));

    			if (maxPages === data.length / 10) {
    				$$invalidate(1, maxPages = maxPages - 1);
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$h.warn(`<Carmensandwich> was created with unknown prop '${key}'`);
    	});

    	const click_handler = page => {
    		$$invalidate(0, offset = page);
    		getEntries();
    	};

    	const click_handler_1 = () => {
    		getEntries();
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		BASE_API_PATH,
    		entries,
    		checkMSG,
    		visible,
    		color,
    		page,
    		totaldata,
    		from,
    		to,
    		offset,
    		limit,
    		maxPages,
    		numEntries,
    		getEntries,
    		maxPagesFunction
    	});

    	$$self.$inject_state = $$props => {
    		if ('BASE_API_PATH' in $$props) BASE_API_PATH = $$props.BASE_API_PATH;
    		if ('entries' in $$props) $$invalidate(2, entries = $$props.entries);
    		if ('checkMSG' in $$props) checkMSG = $$props.checkMSG;
    		if ('visible' in $$props) visible = $$props.visible;
    		if ('color' in $$props) color = $$props.color;
    		if ('page' in $$props) $$invalidate(4, page = $$props.page);
    		if ('totaldata' in $$props) totaldata = $$props.totaldata;
    		if ('from' in $$props) from = $$props.from;
    		if ('to' in $$props) to = $$props.to;
    		if ('offset' in $$props) $$invalidate(0, offset = $$props.offset);
    		if ('limit' in $$props) limit = $$props.limit;
    		if ('maxPages' in $$props) $$invalidate(1, maxPages = $$props.maxPages);
    		if ('numEntries' in $$props) numEntries = $$props.numEntries;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [offset, maxPages, entries, getEntries, page, click_handler, click_handler_1];
    }

    class Carmensandwich extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Carmensandwich",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\front\streamers\kerios.svelte generated by Svelte v3.47.0 */

    const { console: console_1$g } = globals;
    const file$j = "src\\front\\streamers\\kerios.svelte";

    function get_each_context$g(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$g(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$g.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$g(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$g] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$g.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$g(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$j, 52, 5, 971);
    			add_location(td1, file$j, 53, 5, 999);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$j, 54, 102, 1127);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$j, 54, 9, 1034);
    			add_location(td2, file$j, 54, 5, 1030);
    			add_location(td3, file$j, 55, 5, 1215);
    			add_location(td4, file$j, 56, 5, 1248);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$j, 59, 6, 1313);
    			add_location(td5, file$j, 58, 20, 1302);
    			add_location(tr, file$j, 51, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$g.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$g(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$j, 39, 4, 751);
    			add_location(th1, file$j, 40, 4, 771);
    			add_location(th2, file$j, 41, 4, 793);
    			add_location(th3, file$j, 42, 4, 816);
    			add_location(th4, file$j, 43, 4, 845);
    			add_location(th5, file$j, 44, 4, 864);
    			add_location(tr0, file$j, 38, 3, 742);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$j, 37, 2, 716);
    			add_location(tr1, file$j, 48, 3, 913);
    			add_location(tbody, file$j, 47, 2, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$g(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$g(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$g.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$g(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$g.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$g,
    		then: create_then_block$g,
    		catch: create_catch_block$g,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Kerios";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$j, 26, 4, 589);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$j, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$j, 24, 1, 522);
    			add_location(main, file$j, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Kerios', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/kerios");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$g.warn(`<Kerios> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Kerios extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Kerios",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\front\streamers\JavierrLoL.svelte generated by Svelte v3.47.0 */

    const { console: console_1$f } = globals;
    const file$i = "src\\front\\streamers\\JavierrLoL.svelte";

    function get_each_context$f(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$f(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$f.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$f(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$f] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$f.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$f(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$i, 52, 5, 979);
    			add_location(td1, file$i, 53, 5, 1007);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$i, 54, 102, 1135);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$i, 54, 9, 1042);
    			add_location(td2, file$i, 54, 5, 1038);
    			add_location(td3, file$i, 55, 5, 1223);
    			add_location(td4, file$i, 56, 5, 1256);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$i, 59, 6, 1321);
    			add_location(td5, file$i, 58, 20, 1310);
    			add_location(tr, file$i, 51, 4, 969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$f.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$f(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$i, 39, 4, 759);
    			add_location(th1, file$i, 40, 4, 779);
    			add_location(th2, file$i, 41, 4, 801);
    			add_location(th3, file$i, 42, 4, 824);
    			add_location(th4, file$i, 43, 4, 853);
    			add_location(th5, file$i, 44, 4, 872);
    			add_location(tr0, file$i, 38, 3, 750);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$i, 37, 2, 724);
    			add_location(tr1, file$i, 48, 3, 921);
    			add_location(tbody, file$i, 47, 2, 910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$f(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$f(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$f(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$f.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$f,
    		then: create_then_block$f,
    		catch: create_catch_block$f,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: JavierrLoL";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$i, 26, 4, 593);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$i, 25, 2, 557);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$i, 24, 1, 526);
    			add_location(main, file$i, 22, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('JavierrLoL', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/JavierrLoL");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$f.warn(`<JavierrLoL> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class JavierrLoL extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JavierrLoL",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\front\streamers\zeling.svelte generated by Svelte v3.47.0 */

    const { console: console_1$e } = globals;
    const file$h = "src\\front\\streamers\\zeling.svelte";

    function get_each_context$e(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$e(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$e.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$e(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$e.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$e(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$h, 52, 5, 971);
    			add_location(td1, file$h, 53, 5, 999);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$h, 54, 102, 1127);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$h, 54, 9, 1034);
    			add_location(td2, file$h, 54, 5, 1030);
    			add_location(td3, file$h, 55, 5, 1215);
    			add_location(td4, file$h, 56, 5, 1248);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$h, 59, 6, 1313);
    			add_location(td5, file$h, 58, 20, 1302);
    			add_location(tr, file$h, 51, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$e.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$e(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$h, 39, 4, 751);
    			add_location(th1, file$h, 40, 4, 771);
    			add_location(th2, file$h, 41, 4, 793);
    			add_location(th3, file$h, 42, 4, 816);
    			add_location(th4, file$h, 43, 4, 845);
    			add_location(th5, file$h, 44, 4, 864);
    			add_location(tr0, file$h, 38, 3, 742);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$h, 37, 2, 716);
    			add_location(tr1, file$h, 48, 3, 913);
    			add_location(tbody, file$h, 47, 2, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$e(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$e(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$e(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$e.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$e,
    		then: create_then_block$e,
    		catch: create_catch_block$e,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: zeling";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$h, 26, 4, 589);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$h, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$h, 24, 1, 522);
    			add_location(main, file$h, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Zeling', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/zeling");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$e.warn(`<Zeling> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Zeling extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Zeling",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\front\streamers\th3antonio.svelte generated by Svelte v3.47.0 */

    const { console: console_1$d } = globals;
    const file$g = "src\\front\\streamers\\th3antonio.svelte";

    function get_each_context$d(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$d(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$d.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$d(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$d] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$d.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$d(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$g, 52, 5, 979);
    			add_location(td1, file$g, 53, 5, 1007);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$g, 54, 102, 1135);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$g, 54, 9, 1042);
    			add_location(td2, file$g, 54, 5, 1038);
    			add_location(td3, file$g, 55, 5, 1223);
    			add_location(td4, file$g, 56, 5, 1256);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$g, 59, 6, 1321);
    			add_location(td5, file$g, 58, 20, 1310);
    			add_location(tr, file$g, 51, 4, 969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$d.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$d(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$g, 39, 4, 759);
    			add_location(th1, file$g, 40, 4, 779);
    			add_location(th2, file$g, 41, 4, 801);
    			add_location(th3, file$g, 42, 4, 824);
    			add_location(th4, file$g, 43, 4, 853);
    			add_location(th5, file$g, 44, 4, 872);
    			add_location(tr0, file$g, 38, 3, 750);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$g, 37, 2, 724);
    			add_location(tr1, file$g, 48, 3, 921);
    			add_location(tbody, file$g, 47, 2, 910);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$d(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$d(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$d.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$d,
    		then: create_then_block$d,
    		catch: create_catch_block$d,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: th3antonio";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$g, 26, 4, 593);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$g, 25, 2, 557);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$g, 24, 1, 526);
    			add_location(main, file$g, 22, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Th3antonio', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/th3antonio");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$d.warn(`<Th3antonio> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Th3antonio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Th3antonio",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\front\streamers\xixauxas.svelte generated by Svelte v3.47.0 */

    const { console: console_1$c } = globals;
    const file$f = "src\\front\\streamers\\xixauxas.svelte";

    function get_each_context$c(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$c(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$c.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$c(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$c] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$c.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$c(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$f, 52, 5, 975);
    			add_location(td1, file$f, 53, 5, 1003);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$f, 54, 102, 1131);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$f, 54, 9, 1038);
    			add_location(td2, file$f, 54, 5, 1034);
    			add_location(td3, file$f, 55, 5, 1219);
    			add_location(td4, file$f, 56, 5, 1252);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$f, 59, 6, 1317);
    			add_location(td5, file$f, 58, 20, 1306);
    			add_location(tr, file$f, 51, 4, 965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$c.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$c(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$f, 39, 4, 755);
    			add_location(th1, file$f, 40, 4, 775);
    			add_location(th2, file$f, 41, 4, 797);
    			add_location(th3, file$f, 42, 4, 820);
    			add_location(th4, file$f, 43, 4, 849);
    			add_location(th5, file$f, 44, 4, 868);
    			add_location(tr0, file$f, 38, 3, 746);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$f, 37, 2, 720);
    			add_location(tr1, file$f, 48, 3, 917);
    			add_location(tbody, file$f, 47, 2, 906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$c(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$c(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$c(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$c.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$c,
    		then: create_then_block$c,
    		catch: create_catch_block$c,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: xixauxas";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$f, 26, 4, 591);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$f, 25, 2, 555);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$f, 24, 1, 524);
    			add_location(main, file$f, 22, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Xixauxas', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/xixauxas");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$c.warn(`<Xixauxas> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Xixauxas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Xixauxas",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\front\streamers\grekko_.svelte generated by Svelte v3.47.0 */

    const { console: console_1$b } = globals;
    const file$e = "src\\front\\streamers\\grekko_.svelte";

    function get_each_context$b(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$b(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$b.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$b(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$b.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$b(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$e, 52, 5, 973);
    			add_location(td1, file$e, 53, 5, 1001);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$e, 54, 102, 1129);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$e, 54, 9, 1036);
    			add_location(td2, file$e, 54, 5, 1032);
    			add_location(td3, file$e, 55, 5, 1217);
    			add_location(td4, file$e, 56, 5, 1250);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$e, 59, 6, 1315);
    			add_location(td5, file$e, 58, 20, 1304);
    			add_location(tr, file$e, 51, 4, 963);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$b.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$b(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$e, 39, 4, 753);
    			add_location(th1, file$e, 40, 4, 773);
    			add_location(th2, file$e, 41, 4, 795);
    			add_location(th3, file$e, 42, 4, 818);
    			add_location(th4, file$e, 43, 4, 847);
    			add_location(th5, file$e, 44, 4, 866);
    			add_location(tr0, file$e, 38, 3, 744);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$e, 37, 2, 718);
    			add_location(tr1, file$e, 48, 3, 915);
    			add_location(tbody, file$e, 47, 2, 904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$b(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$b(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$b(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$b.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$b,
    		then: create_then_block$b,
    		catch: create_catch_block$b,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: grekko_";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$e, 26, 4, 590);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$e, 25, 2, 554);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$e, 24, 1, 523);
    			add_location(main, file$e, 22, 0, 514);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grekko', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/grekko_");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$b.warn(`<Grekko> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Grekko extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grekko",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\front\streamers\pausenpaii.svelte generated by Svelte v3.47.0 */

    const { console: console_1$a } = globals;
    const file$d = "src\\front\\streamers\\pausenpaii.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$a(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$a.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block$a(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$a.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block$a(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$d, 53, 5, 1004);
    			add_location(td1, file$d, 54, 5, 1032);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$d, 55, 102, 1160);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$d, 55, 9, 1067);
    			add_location(td2, file$d, 55, 5, 1063);
    			add_location(td3, file$d, 56, 5, 1248);
    			add_location(td4, file$d, 57, 5, 1281);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$d, 60, 6, 1346);
    			add_location(td5, file$d, 59, 20, 1335);
    			add_location(tr, file$d, 52, 4, 994);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot$a(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$d, 40, 4, 784);
    			add_location(th1, file$d, 41, 4, 804);
    			add_location(th2, file$d, 42, 4, 826);
    			add_location(th3, file$d, 43, 4, 849);
    			add_location(th4, file$d, 44, 4, 878);
    			add_location(th5, file$d, 45, 4, 897);
    			add_location(tr0, file$d, 39, 3, 775);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$d, 38, 2, 749);
    			add_location(tr1, file$d, 49, 3, 946);
    			add_location(tbody, file$d, 48, 2, 935);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$a(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$a(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$a.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$a,
    		then: create_then_block$a,
    		catch: create_catch_block$a,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: pausenpaii";
    			t1 = space();
    			title = element("title");
    			title.textContent = "Skain";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$d, 26, 4, 593);
    			add_location(title, file$d, 27, 4, 627);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$d, 25, 2, 557);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$d, 24, 1, 526);
    			add_location(main, file$d, 22, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pausenpaii', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/pausenpaii");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$a.warn(`<Pausenpaii> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Pausenpaii extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pausenpaii",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\front\streamers\holasoysergio1.svelte generated by Svelte v3.47.0 */

    const { console: console_1$9 } = globals;
    const file$c = "src\\front\\streamers\\holasoysergio1.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$9(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$9.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$9(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$9.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$9(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$c, 52, 5, 987);
    			add_location(td1, file$c, 53, 5, 1015);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$c, 54, 102, 1143);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$c, 54, 9, 1050);
    			add_location(td2, file$c, 54, 5, 1046);
    			add_location(td3, file$c, 55, 5, 1231);
    			add_location(td4, file$c, 56, 5, 1264);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$c, 59, 6, 1329);
    			add_location(td5, file$c, 58, 20, 1318);
    			add_location(tr, file$c, 51, 4, 977);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$9(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$c, 39, 4, 767);
    			add_location(th1, file$c, 40, 4, 787);
    			add_location(th2, file$c, 41, 4, 809);
    			add_location(th3, file$c, 42, 4, 832);
    			add_location(th4, file$c, 43, 4, 861);
    			add_location(th5, file$c, 44, 4, 880);
    			add_location(tr0, file$c, 38, 3, 758);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$c, 37, 2, 732);
    			add_location(tr1, file$c, 48, 3, 929);
    			add_location(tbody, file$c, 47, 2, 918);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$9.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$9,
    		then: create_then_block$9,
    		catch: create_catch_block$9,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: holasoysergio1";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$c, 26, 4, 597);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$c, 25, 2, 561);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$c, 24, 1, 530);
    			add_location(main, file$c, 22, 0, 521);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Holasoysergio1', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/holasoysergio1");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$9.warn(`<Holasoysergio1> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Holasoysergio1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Holasoysergio1",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\front\streamers\miniduke.svelte generated by Svelte v3.47.0 */

    const { console: console_1$8 } = globals;
    const file$b = "src\\front\\streamers\\miniduke.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$8(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$8.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block$8(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$8.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block$8(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$b, 53, 5, 1003);
    			add_location(td1, file$b, 54, 5, 1031);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$b, 55, 60, 1117);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			add_location(a, file$b, 55, 9, 1066);
    			add_location(td2, file$b, 55, 5, 1062);
    			add_location(td3, file$b, 56, 5, 1205);
    			add_location(td4, file$b, 57, 5, 1238);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$b, 60, 6, 1303);
    			add_location(td5, file$b, 59, 20, 1292);
    			add_location(tr, file$b, 52, 4, 993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot$8(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$b, 40, 4, 783);
    			add_location(th1, file$b, 41, 4, 803);
    			add_location(th2, file$b, 42, 4, 825);
    			add_location(th3, file$b, 43, 4, 848);
    			add_location(th4, file$b, 44, 4, 877);
    			add_location(th5, file$b, 45, 4, 896);
    			add_location(tr0, file$b, 39, 3, 774);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$b, 38, 2, 748);
    			add_location(tr1, file$b, 49, 3, 945);
    			add_location(tbody, file$b, 48, 2, 934);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block$8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$8.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$8,
    		then: create_then_block$8,
    		catch: create_catch_block$8,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: miniduke";
    			t1 = space();
    			title = element("title");
    			title.textContent = "miniduke";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$b, 26, 4, 591);
    			add_location(title, file$b, 27, 4, 623);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$b, 25, 2, 555);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$b, 24, 1, 524);
    			add_location(main, file$b, 22, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Miniduke', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/miniduke");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Miniduke> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Miniduke extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Miniduke",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\front\streamers\send0o.svelte generated by Svelte v3.47.0 */

    const { console: console_1$7 } = globals;
    const file$a = "src\\front\\streamers\\send0o.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$7(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$7.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$7(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$7.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$a, 52, 5, 971);
    			add_location(td1, file$a, 53, 5, 999);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$a, 54, 102, 1127);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$a, 54, 9, 1034);
    			add_location(td2, file$a, 54, 5, 1030);
    			add_location(td3, file$a, 55, 5, 1215);
    			add_location(td4, file$a, 56, 5, 1248);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$a, 59, 6, 1313);
    			add_location(td5, file$a, 58, 20, 1302);
    			add_location(tr, file$a, 51, 4, 961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$7(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$a, 39, 4, 751);
    			add_location(th1, file$a, 40, 4, 771);
    			add_location(th2, file$a, 41, 4, 793);
    			add_location(th3, file$a, 42, 4, 816);
    			add_location(th4, file$a, 43, 4, 845);
    			add_location(th5, file$a, 44, 4, 864);
    			add_location(tr0, file$a, 38, 3, 742);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$a, 37, 2, 716);
    			add_location(tr1, file$a, 48, 3, 913);
    			add_location(tbody, file$a, 47, 2, 902);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$7.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$7,
    		then: create_then_block$7,
    		catch: create_catch_block$7,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: send0o";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$a, 26, 4, 589);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$a, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$a, 24, 1, 522);
    			add_location(main, file$a, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Send0o', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/send0o");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Send0o> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Send0o extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Send0o",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\front\streamers\getflakked.svelte generated by Svelte v3.47.0 */

    const { console: console_1$6 } = globals;
    const file$9 = "src\\front\\streamers\\getflakked.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$6(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$6.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block$6(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$6.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block$6(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$9, 53, 5, 1009);
    			add_location(td1, file$9, 54, 5, 1037);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$9, 55, 102, 1165);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$9, 55, 9, 1072);
    			add_location(td2, file$9, 55, 5, 1068);
    			add_location(td3, file$9, 56, 5, 1253);
    			add_location(td4, file$9, 57, 5, 1286);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$9, 60, 6, 1351);
    			add_location(td5, file$9, 59, 20, 1340);
    			add_location(tr, file$9, 52, 4, 999);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot$6(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$9, 40, 4, 789);
    			add_location(th1, file$9, 41, 4, 809);
    			add_location(th2, file$9, 42, 4, 831);
    			add_location(th3, file$9, 43, 4, 854);
    			add_location(th4, file$9, 44, 4, 883);
    			add_location(th5, file$9, 45, 4, 902);
    			add_location(tr0, file$9, 39, 3, 780);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$9, 38, 2, 754);
    			add_location(tr1, file$9, 49, 3, 951);
    			add_location(tbody, file$9, 48, 2, 940);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$6(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$6.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$6,
    		then: create_then_block$6,
    		catch: create_catch_block$6,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: getflakked";
    			t1 = space();
    			title = element("title");
    			title.textContent = "getflakked";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$9, 26, 4, 593);
    			add_location(title, file$9, 27, 4, 627);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$9, 25, 2, 557);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$9, 24, 1, 526);
    			add_location(main, file$9, 22, 0, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Getflakked', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/getflakked");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Getflakked> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Getflakked extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Getflakked",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\front\streamers\elmiillor.svelte generated by Svelte v3.47.0 */

    const { console: console_1$5 } = globals;
    const file$8 = "src\\front\\streamers\\elmiillor.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$5(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$5.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$5(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$5.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$5(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$8, 52, 5, 977);
    			add_location(td1, file$8, 53, 5, 1005);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$8, 54, 102, 1133);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$8, 54, 9, 1040);
    			add_location(td2, file$8, 54, 5, 1036);
    			add_location(td3, file$8, 55, 5, 1221);
    			add_location(td4, file$8, 56, 5, 1254);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$8, 59, 6, 1319);
    			add_location(td5, file$8, 58, 20, 1308);
    			add_location(tr, file$8, 51, 4, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$5(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$8, 39, 4, 757);
    			add_location(th1, file$8, 40, 4, 777);
    			add_location(th2, file$8, 41, 4, 799);
    			add_location(th3, file$8, 42, 4, 822);
    			add_location(th4, file$8, 43, 4, 851);
    			add_location(th5, file$8, 44, 4, 870);
    			add_location(tr0, file$8, 38, 3, 748);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$8, 37, 2, 722);
    			add_location(tr1, file$8, 48, 3, 919);
    			add_location(tbody, file$8, 47, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$5.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$5,
    		then: create_then_block$5,
    		catch: create_catch_block$5,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: elmiillor";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$8, 26, 4, 592);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$8, 25, 2, 556);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$8, 24, 1, 525);
    			add_location(main, file$8, 22, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Elmiillor', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/elmiillor");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Elmiillor> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Elmiillor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Elmiillor",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\front\streamers\pepiinero.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\front\\streamers\\pepiinero.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$4(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$4.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$4(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$4.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$4(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$7, 52, 5, 977);
    			add_location(td1, file$7, 53, 5, 1005);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$7, 54, 102, 1133);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$7, 54, 9, 1040);
    			add_location(td2, file$7, 54, 5, 1036);
    			add_location(td3, file$7, 55, 5, 1221);
    			add_location(td4, file$7, 56, 5, 1254);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$7, 59, 6, 1319);
    			add_location(td5, file$7, 58, 20, 1308);
    			add_location(tr, file$7, 51, 4, 967);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$4(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$7, 39, 4, 757);
    			add_location(th1, file$7, 40, 4, 777);
    			add_location(th2, file$7, 41, 4, 799);
    			add_location(th3, file$7, 42, 4, 822);
    			add_location(th4, file$7, 43, 4, 851);
    			add_location(th5, file$7, 44, 4, 870);
    			add_location(tr0, file$7, 38, 3, 748);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$7, 37, 2, 722);
    			add_location(tr1, file$7, 48, 3, 919);
    			add_location(tbody, file$7, 47, 2, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$4.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$4,
    		then: create_then_block$4,
    		catch: create_catch_block$4,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: pepiinero";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$7, 26, 4, 592);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$7, 25, 2, 556);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$7, 24, 1, 525);
    			add_location(main, file$7, 22, 0, 516);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Pepiinero', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/pepiinero");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Pepiinero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Pepiinero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pepiinero",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\front\streamers\jaimemellado_.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\front\\streamers\\jaimemellado_.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$3(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$3.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$3(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$3.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$6, 52, 5, 985);
    			add_location(td1, file$6, 53, 5, 1013);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$6, 54, 102, 1141);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$6, 54, 9, 1048);
    			add_location(td2, file$6, 54, 5, 1044);
    			add_location(td3, file$6, 55, 5, 1229);
    			add_location(td4, file$6, 56, 5, 1262);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$6, 59, 6, 1327);
    			add_location(td5, file$6, 58, 20, 1316);
    			add_location(tr, file$6, 51, 4, 975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$3(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$6, 39, 4, 765);
    			add_location(th1, file$6, 40, 4, 785);
    			add_location(th2, file$6, 41, 4, 807);
    			add_location(th3, file$6, 42, 4, 830);
    			add_location(th4, file$6, 43, 4, 859);
    			add_location(th5, file$6, 44, 4, 878);
    			add_location(tr0, file$6, 38, 3, 756);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$6, 37, 2, 730);
    			add_location(tr1, file$6, 48, 3, 927);
    			add_location(tbody, file$6, 47, 2, 916);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$3.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$3,
    		then: create_then_block$3,
    		catch: create_catch_block$3,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: jaimemellado_";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$6, 26, 4, 596);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$6, 25, 2, 560);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$6, 24, 1, 529);
    			add_location(main, file$6, 22, 0, 520);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Jaimemellado', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/jaimemellado_");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Jaimemellado> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Jaimemellado extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Jaimemellado",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\front\streamers\champi14.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;
    const file$5 = "src\\front\\streamers\\champi14.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$2(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$2.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (34:1) {:then entries}
    function create_then_block$2(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$2.name,
    		type: "then",
    		source: "(34:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (51:3) {#each entries as entry}
    function create_each_block$2(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$5, 52, 5, 975);
    			add_location(td1, file$5, 53, 5, 1003);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$5, 54, 102, 1131);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$5, 54, 9, 1038);
    			add_location(td2, file$5, 54, 5, 1034);
    			add_location(td3, file$5, 55, 5, 1219);
    			add_location(td4, file$5, 56, 5, 1252);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$5, 59, 6, 1317);
    			add_location(td5, file$5, 58, 20, 1306);
    			add_location(tr, file$5, 51, 4, 965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(51:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (35:1) <Table bordered>
    function create_default_slot$2(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$5, 39, 4, 755);
    			add_location(th1, file$5, 40, 4, 775);
    			add_location(th2, file$5, 41, 4, 797);
    			add_location(th3, file$5, 42, 4, 820);
    			add_location(th4, file$5, 43, 4, 849);
    			add_location(th5, file$5, 44, 4, 868);
    			add_location(tr0, file$5, 38, 3, 746);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$5, 37, 2, 720);
    			add_location(tr1, file$5, 48, 3, 917);
    			add_location(tbody, file$5, 47, 2, 906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(35:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (32:16)  loading  {:then entries}
    function create_pending_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$2.name,
    		type: "pending",
    		source: "(32:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$2,
    		then: create_then_block$2,
    		catch: create_catch_block$2,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: champi14";
    			t1 = space();
    			info.block.c();
    			add_location(h1, file$5, 26, 4, 591);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$5, 25, 2, 555);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$5, 24, 1, 524);
    			add_location(main, file$5, 22, 0, 515);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(main, t1);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Champi14', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/champi14");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Champi14> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Champi14 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Champi14",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\front\streamers\knekro.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$4 = "src\\front\\streamers\\knekro.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block$1(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block$1(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block$1(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$4, 53, 5, 997);
    			add_location(td1, file$4, 54, 5, 1025);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$4, 55, 102, 1153);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$4, 55, 9, 1060);
    			add_location(td2, file$4, 55, 5, 1056);
    			add_location(td3, file$4, 56, 5, 1241);
    			add_location(td4, file$4, 57, 5, 1274);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$4, 60, 6, 1339);
    			add_location(td5, file$4, 59, 20, 1328);
    			add_location(tr, file$4, 52, 4, 987);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot$1(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$4, 40, 4, 777);
    			add_location(th1, file$4, 41, 4, 797);
    			add_location(th2, file$4, 42, 4, 819);
    			add_location(th3, file$4, 43, 4, 842);
    			add_location(th4, file$4, 44, 4, 871);
    			add_location(th5, file$4, 45, 4, 890);
    			add_location(tr0, file$4, 39, 3, 768);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$4, 38, 2, 742);
    			add_location(tr1, file$4, 49, 3, 939);
    			add_location(tbody, file$4, 48, 2, 928);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: Knekro";
    			t1 = space();
    			title = element("title");
    			title.textContent = "Knekro";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$4, 26, 4, 589);
    			add_location(title, file$4, 27, 4, 619);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$4, 25, 2, 553);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$4, 24, 1, 522);
    			add_location(main, file$4, 22, 0, 513);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Knekro', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/knekro");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Knekro> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Knekro extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Knekro",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\front\streamers\ibai.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$3 = "src\\front\\streamers\\ibai.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (1:0) <script>      import { onMount }
    function create_catch_block(ctx) {
    	const block = {
    		c: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(1:0) <script>      import { onMount }",
    		ctx
    	});

    	return block;
    }

    // (35:1) {:then entries}
    function create_then_block(ctx) {
    	let table;
    	let current;

    	table = new Table({
    			props: {
    				bordered: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(table.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(table, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};

    			if (dirty & /*$$scope, entries*/ 33) {
    				table_changes.$$scope = { dirty, ctx };
    			}

    			table.$set(table_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(table, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(35:1) {:then entries}",
    		ctx
    	});

    	return block;
    }

    // (52:3) {#each entries as entry}
    function create_each_block(ctx) {
    	let tr;
    	let td0;
    	let t0_value = /*entry*/ ctx[2].title + "";
    	let t0;
    	let t1;
    	let td1;
    	let t2_value = /*entry*/ ctx[2].duration + "";
    	let t2;
    	let t3;
    	let td2;
    	let a;
    	let button;
    	let a_href_value;
    	let t5;
    	let td3;
    	let t6_value = /*entry*/ ctx[2].view_count + "";
    	let t6;
    	let t7;
    	let td4;
    	let t8_value = /*entry*/ ctx[2].created_at + "";
    	let t8;
    	let t9;
    	let td5;
    	let iframe;
    	let iframe_src_value;
    	let t10;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			td1 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td2 = element("td");
    			a = element("a");
    			button = element("button");
    			button.textContent = "Link";
    			t5 = space();
    			td3 = element("td");
    			t6 = text(t6_value);
    			t7 = space();
    			td4 = element("td");
    			t8 = text(t8_value);
    			t9 = space();
    			td5 = element("td");
    			iframe = element("iframe");
    			t10 = space();
    			add_location(td0, file$3, 53, 5, 991);
    			add_location(td1, file$3, 54, 5, 1019);
    			attr_dev(button, "class", "btn btn-primary");
    			attr_dev(button, "target", "_blank");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$3, 55, 102, 1147);
    			attr_dev(a, "href", a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "rel", "noopener noreferrer");
    			add_location(a, file$3, 55, 9, 1054);
    			add_location(td2, file$3, 55, 5, 1050);
    			add_location(td3, file$3, 56, 5, 1235);
    			add_location(td4, file$3, 57, 5, 1268);
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "720");
    			attr_dev(iframe, "width", "1280");
    			iframe.allowFullscreen = true;
    			add_location(iframe, file$3, 60, 6, 1333);
    			add_location(td5, file$3, 59, 20, 1322);
    			add_location(tr, file$3, 52, 4, 981);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			append_dev(td0, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td1);
    			append_dev(td1, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td2);
    			append_dev(td2, a);
    			append_dev(a, button);
    			append_dev(tr, t5);
    			append_dev(tr, td3);
    			append_dev(td3, t6);
    			append_dev(tr, t7);
    			append_dev(tr, td4);
    			append_dev(td4, t8);
    			append_dev(tr, t9);
    			append_dev(tr, td5);
    			append_dev(td5, iframe);
    			append_dev(tr, t10);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1 && t0_value !== (t0_value = /*entry*/ ctx[2].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*entries*/ 1 && t2_value !== (t2_value = /*entry*/ ctx[2].duration + "")) set_data_dev(t2, t2_value);

    			if (dirty & /*entries*/ 1 && a_href_value !== (a_href_value = "https://clipsey.com/?clipurl=" + /*entry*/ ctx[2].url)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*entries*/ 1 && t6_value !== (t6_value = /*entry*/ ctx[2].view_count + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*entries*/ 1 && t8_value !== (t8_value = /*entry*/ ctx[2].created_at + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*entries*/ 1 && !src_url_equal(iframe.src, iframe_src_value = "https://clips.twitch.tv/embed?clip=" + /*entry*/ ctx[2].id + "&parent=localhost")) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(52:3) {#each entries as entry}",
    		ctx
    	});

    	return block;
    }

    // (36:1) <Table bordered>
    function create_default_slot(ctx) {
    	let thead;
    	let tr0;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let th4;
    	let t9;
    	let th5;
    	let t11;
    	let tbody;
    	let tr1;
    	let t12;
    	let each_value = /*entries*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr0 = element("tr");
    			th0 = element("th");
    			th0.textContent = "Titulo";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "Duración";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Descargar";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Visualizaciones";
    			t7 = space();
    			th4 = element("th");
    			th4.textContent = "Fecha";
    			t9 = space();
    			th5 = element("th");
    			th5.textContent = "Clip";
    			t11 = space();
    			tbody = element("tbody");
    			tr1 = element("tr");
    			t12 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(th0, file$3, 40, 4, 771);
    			add_location(th1, file$3, 41, 4, 791);
    			add_location(th2, file$3, 42, 4, 813);
    			add_location(th3, file$3, 43, 4, 836);
    			add_location(th4, file$3, 44, 4, 865);
    			add_location(th5, file$3, 45, 4, 884);
    			add_location(tr0, file$3, 39, 3, 762);
    			attr_dev(thead, "id", "titulitos");
    			add_location(thead, file$3, 38, 2, 736);
    			add_location(tr1, file$3, 49, 3, 933);
    			add_location(tbody, file$3, 48, 2, 922);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr0);
    			append_dev(tr0, th0);
    			append_dev(tr0, t1);
    			append_dev(tr0, th1);
    			append_dev(tr0, t3);
    			append_dev(tr0, th2);
    			append_dev(tr0, t5);
    			append_dev(tr0, th3);
    			append_dev(tr0, t7);
    			append_dev(tr0, th4);
    			append_dev(tr0, t9);
    			append_dev(tr0, th5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, tbody, anchor);
    			append_dev(tbody, tr1);
    			append_dev(tbody, t12);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*entries*/ 1) {
    				each_value = /*entries*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(tbody);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(36:1) <Table bordered>",
    		ctx
    	});

    	return block;
    }

    // (33:16)  loading  {:then entries}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("loading");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(33:16)  loading  {:then entries}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let main;
    	let figure;
    	let blockquote;
    	let h1;
    	let t1;
    	let title;
    	let t3;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: false,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 0,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*entries*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			main = element("main");
    			figure = element("figure");
    			blockquote = element("blockquote");
    			h1 = element("h1");
    			h1.textContent = "Streamer: ibai";
    			t1 = space();
    			title = element("title");
    			title.textContent = "ibai";
    			t3 = space();
    			info.block.c();
    			add_location(h1, file$3, 26, 4, 587);
    			add_location(title, file$3, 27, 4, 615);
    			attr_dev(blockquote, "class", "blockquote");
    			add_location(blockquote, file$3, 25, 2, 551);
    			attr_dev(figure, "class", "text-center");
    			add_location(figure, file$3, 24, 1, 520);
    			add_location(main, file$3, 22, 0, 511);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, figure);
    			append_dev(figure, blockquote);
    			append_dev(blockquote, h1);
    			append_dev(blockquote, t1);
    			append_dev(blockquote, title);
    			append_dev(main, t3);
    			info.block.m(main, info.anchor = null);
    			info.mount = () => main;
    			info.anchor = null;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*entries*/ 1 && promise !== (promise = /*entries*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				update_await_block_branch(info, ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			info.block.d();
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Ibai', slots, []);
    	let entries = [];
    	onMount(getEntries);

    	async function getEntries() {
    		console.log("Fetching entries....");
    		const res = await fetch("/api/v1/ibai");

    		if (res.ok) {
    			const data = await res.json();
    			$$invalidate(0, entries = data);
    			console.log("Received entries: " + entries.length);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Ibai> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		Table,
    		Button,
    		entries,
    		getEntries
    	});

    	$$self.$inject_state = $$props => {
    		if ('entries' in $$props) $$invalidate(0, entries = $$props.entries);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [entries];
    }

    class Ibai extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ibai",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\front\components\Footer.svelte generated by Svelte v3.47.0 */

    const file$2 = "src\\front\\components\\Footer.svelte";

    function create_fragment$2(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "https://github.com/Antoniiosc7/TwitchClips";
    			attr_dev(div, "class", "copyright svelte-p8u2kc");
    			add_location(div, file$2, 1, 4, 13);
    			attr_dev(footer, "class", "svelte-p8u2kc");
    			add_location(footer, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\front\components\Header.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\front\\components\\Header.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let a;
    	let h1;

    	const block = {
    		c: function create() {
    			header = element("header");
    			a = element("a");
    			h1 = element("h1");
    			h1.textContent = "Inicio";
    			attr_dev(h1, "class", "svelte-johono");
    			add_location(h1, file$1, 2, 9, 34);
    			attr_dev(a, "href", "");
    			add_location(a, file$1, 1, 4, 13);
    			attr_dev(header, "class", "svelte-johono");
    			add_location(header, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, a);
    			append_dev(a, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\front\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\front\\App.svelte";

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let router;
    	let t1;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-51tonn");
    			add_location(main, file, 71, 0, 2518);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(router, main, null);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(router);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/": Home,
    		//"/tennis" : List,
    		//"/tennis/:country/:year" : Edit
    		"/th3antonio": List,
    		"/elojoninja": Ojoninja,
    		"/elyoya": Elyoya,
    		"/werlyb": Werlyb,
    		"/koldo": Koldo,
    		"/skain": Skain,
    		"/kerios": Kerios,
    		"/carmensandwich": Carmensandwich,
    		"/ffaka": Ffaka,
    		"/nissaxter": Nissaxter,
    		"/pochipoom": Pochipoom,
    		"/JavierrLoL": JavierrLoL,
    		"/th3antonio": Th3antonio,
    		"/zeling": Zeling,
    		"/send0o": Send0o,
    		"/grekko_": Grekko,
    		"/pausenpaii": Pausenpaii,
    		"/holasoysergio1": Holasoysergio1,
    		"/miniduke": Miniduke,
    		"/xixauxas": Xixauxas,
    		"/getflakked": Getflakked,
    		"/elmiillor": Elmiillor,
    		"/pepiinero": Pepiinero,
    		"/jaimemellado_": Jaimemellado,
    		"/champi14": Champi14,
    		"/knekro": Knekro,
    		"/ibai": Ibai,
    		"/leagueoflegends": League
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		List,
    		league: League,
    		ojoninja: Ojoninja,
    		elyoya: Elyoya,
    		werlyb: Werlyb,
    		koldo: Koldo,
    		skain: Skain,
    		nissaxter: Nissaxter,
    		pochipoom: Pochipoom,
    		ffaka: Ffaka,
    		carmensandwich: Carmensandwich,
    		kerios: Kerios,
    		JavierrLoL,
    		zeling: Zeling,
    		th3antonio: Th3antonio,
    		xixauxas: Xixauxas,
    		grekko_: Grekko,
    		pausenpaii: Pausenpaii,
    		holasoysergio1: Holasoysergio1,
    		miniduke: Miniduke,
    		send0o: Send0o,
    		getflakked: Getflakked,
    		elmiillor: Elmiillor,
    		pepiinero: Pepiinero,
    		jaimemellado_: Jaimemellado,
    		champi14: Champi14,
    		knekro: Knekro,
    		ibai: Ibai,
    		Footer,
    		Header,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Grupo 23'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
