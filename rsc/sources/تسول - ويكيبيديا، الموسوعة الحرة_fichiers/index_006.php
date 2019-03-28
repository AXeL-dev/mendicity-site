/* [[وب:ملعب سكربت المستخدم]]
 * User script sandbox
 * http://en.wikipedia.org/wiki/Wikipedia:User_script_sandbox
 *
 * Copyright 2012 Wikipedia user PleaseStand
 *
 * Licensed under the Creative Commons Attribution-Share-Alike 3.0 Unported License,
 * the GNU Free Documentation License (unversioned), and the GNU General Public License
 * (version 2 or any later version); pick the license(s) of your choice.
 *
 * http://creativecommons.org/licenses/by-sa/3.0/
 * http://www.gnu.org/copyleft/fdl.html
 * http://www.gnu.org/copyleft/gpl.html
 */
(function ($, undefined) {
    "use strict";
    /**
     * Configuration for this script.
     */
    var settings = {
        sandboxNamespaceNumber: 4,
        sandboxPageTitle: "ملعب سكربت المستخدم",
        storagePrefix: "userScriptSandbox."
    };
    /**
     * A thin wrapper around localStorage.
     */
    var storage = {
        /**
         * Retrieves a string value from localStorage.
         * @param selection {String} String key to get the value for.
         * @param fallback {String} Value to use in case key does not exist (optional).
         * @return A string value or null.
         */
        get: function (selection, fallback) {
            var value = localStorage.getItem(settings.storagePrefix + selection);
            return value != null ? value : (fallback != null ? fallback : null);
        },
        /**
         * Sets a key/value pair in localStorage.
         * @param selection {String} String key to set the value for.
         * @param value {mixed} String value to set (null or undefined to remove).
         */
        set: function (key, value) {
            if (value == null) {
                localStorage.removeItem(settings.storagePrefix + key);
            } else {
                localStorage.setItem(settings.storagePrefix + key, value);
            }
        }
    };
    /**
     * The sandbox editor interface code.
     */
    var editor = {
        dependencies: ["mediawiki.user", "mediawiki.util", "jquery.ui.tabs"],
        /**
         * Shows the user interface for the sandbox editor.
         */
        show: function () {
            var textareaProps = {
                cols: mw.user.options.get("cols"),
                rows: mw.user.options.get("rows")
            };
            // CSS to add
            mw.util.addCSS("#sandbox-tabs { font-size: 1em; } " +
                "#sandbox-wrapper textarea { font-family: monospace, sans-serif; }");
            // Elements to add
            editor.$wrapper = $("#sandbox-wrapper");
            editor.$enabled = $("<input id='sandbox-enabled' type='checkbox'>");
            editor.$dependencies = $("<input id='sandbox-dependencies' type='text' style='width: 80%;'>");
            editor.$jsArea = $("<textarea id='sandbox-js-area'></textarea>").prop(textareaProps);
            editor.$cssArea = $("<textarea id='sandbox-css-area'></textarea>").prop(textareaProps);
            editor.$saveLocal = $("<button id='sandbox-save-local'></button>");
            // Modifications to wiki page
            $("#sandbox-enabled-placeholder").replaceWith(editor.$enabled);
            $("#sandbox-enabled-label").wrapAll("<label for='sandbox-enabled'></label>");
            $("#sandbox-dependencies-label").wrapAll("<label for='sandbox-dependencies'></label>");
            $("#sandbox-dependencies-placeholder").replaceWith(editor.$dependencies);
            $("#sandbox-tabs").tabs();
            $("#sandbox-js-area-placeholder").replaceWith(editor.$jsArea);
            $("#sandbox-css-area-placeholder").replaceWith(editor.$cssArea);
            // .wrapAll() does not suffice because it clones the the wrapping element.
            $("#sandbox-save-local-text")
                .replaceWith(editor.$saveLocal)
                .appendTo(editor.$saveLocal);
            // Event handling functions
            editor.loadSandbox();
            editor.$saveLocal.click(editor.saveSandbox);
            editor.$wrapper.on("change keypress", ":input", editor.handleChange);
            $("#sandbox-loading").hide();
            editor.$wrapper.show();
        },
        /**
         * Called when a form field's value changes or a key is pressed.
         */
        handleChange: function (event) {
            // Ignore arrow keys in Firefox.
            if (event.type === "keypress" && !event.which) {
                return;
            }
            editor.$saveLocal.prop("disabled", false);
        },
        /**
         * Loads the contents of the sandbox editor from localStorage.
         */
        loadSandbox: function () {
            editor.$saveLocal.prop("disabled", true);
            editor.$enabled.prop("checked", +storage.get("enabled"));
            editor.$dependencies.val(storage.get("dependencies"));
            editor.$jsArea.val(storage.get("js"));
            editor.$cssArea.val(storage.get("css"));
        },
        /**
         * Saves the contents of the sandbox editor to localStorage.
         */
        saveSandbox: function () {
            editor.$saveLocal.prop("disabled", true);
            storage.set("enabled", editor.$enabled.prop("checked") ? "1" : "0");
            storage.set("dependencies", editor.$dependencies.val());
            storage.set("js", editor.$jsArea.val());
            storage.set("css", editor.$cssArea.val());
        }
    };
    /**
     * Runs any CSS and JS code from localStorage once dependencies have been satisfied.
     */

    function runSandbox() {
        var enabled, css, js, dependencies;
        enabled = +storage.get("enabled", "0");
        if (!enabled) {
            return;
        }
        css = storage.get("css", "");
        js = storage.get("js", "");
        dependencies = $.trim(storage.get("dependencies", "")).split(/\s*,\s*/);
        mw.loader.using("mediawiki.util", function () {
            mw.util.addCSS(css);
        });
        mw.loader.using(dependencies[0] ? dependencies : [], function () {
            $.globalEval(js + "\n//@ sourceURL=localSandbox.js");
        });
    }
    /**
     * Initialization code
     */

    function main() {
        // localStorage is required for any of this to work.
        if (!window.localStorage) {
            return;
        }
        // On the sandbox page, run the editor instead of the code in the sandbox.
        if (mw.config.get("wgAction") === "view" &&
            mw.config.get("wgNamespaceNumber") === settings.sandboxNamespaceNumber &&
            mw.config.get("wgTitle") === settings.sandboxPageTitle) {
            // Prevent clickjacking.
            if (window.top !== window.self) {
                return;
            }
            mw.loader.using(editor.dependencies, function () {
                $(editor.show);
            });
        } else {
            runSandbox();
        }
    }
    main();
})(jQuery);

mw.util.addCSS("#sandbox-js-area, #sandbox-css-area {direction: ltr; line-height: 1.5em; }");