YUI.add('moodle-atto_cleantest-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_cleantest
 * @copyright  2021 Eric Merrill (merrill@oakland.edu)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_cleantest-button
 */

/**
 * Atto text editor preview plugin.
 *
 * @namespace M.atto_cleantest
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var PLUGINNAME = 'atto_cleantest',
    LOGNAME = 'atto_cleantest',
    TEMPLATE = '' +
            '<div class="hide">' +
                '<a class="btn btn-secondary" id="run">Run</a>' +
            '</div>' +
            '<h3>Running {{testCount}} tests</h3>' +
            '<div>' +
                '<div id="passed" class="alert alert-success alert-block">Pass</div>' +
                '<div id="failed" class="alert alert-danger alert-block">Fail</div>' +
            '</div>' +
            '<hr/><div id="results"></div>',
    TESTTEMPLATE = '' +
            '<div class="codetest">' +
                '<div>' +
                    '{{#if about}}<div>{{about}}</div>{{/if}}' +
                    '{{#if pass}}' +
                        '<div class="alert alert-success alert-block" data-toggle="collapse" href="#collapse{{testNumber}}" ' +
                        'role="button" aria-expanded="false" aria-controls="collapse{{testNumber}}" ' +
                        'style="padding:0.25rem 1.25rem">{{testNumber}} - Pass - Click to expand<br/></div>' +
                    '{{else}}' +
                        '<div class="alert alert-danger alert-block" data-toggle="collapse" href="#collapse{{testNumber}}" ' +
                        'role="button" aria-expanded="true" aria-controls="collapse{{testNumber}}" ' +
                        'style="padding:0.25rem 1.25rem">{{testNumber}} - Fail</div>' +
                    '{{/if}}' +
                '</div>' +
                '<div class="collapse {{#unless pass}}show{{/unless}}" id="collapse{{testNumber}}">' +
                    '<div>' +
                        '<div>Input:</div>' +
                        '<code><pre class="codeinput">{{inputCode}}</pre></code>' +
                    '</div>' +
                    '<div>' +
                        '<div>Output:</div>' +
                        '<code><pre class="codeoutput">{{outputCode}}</pre></code>' +
                    '</div>' +
                    '<div>' +
                        '<div>Expected:</div>' +
                        '<code><pre class="codeexpected">{{expectedCode}}</pre></code>' +
                    '</div>' +
                '</div>' +
                '<hr style="margin:0.25rem"/>' +
            '</div>'
    ;

Y.namespace('M.atto_cleantest').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
    dialogue: null,

    initializer: function() {
        var button = this.addButton({
            icon: 'e/question',
            callback: this._open
        });
        button.set('title', M.util.get_string('pluginname', PLUGINNAME));

    },

    _open: function(e) {
        e.preventDefault();

        Y.log('Cleaner clicked', 'debug', LOGNAME);

        this.dialogue = this.getDialogue({
            modal: false,
            headerContent: M.util.get_string('pluginname', PLUGINNAME),
            width: '600px'
        });

        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({testCount: this.get('tests').length}));
        content.one('#run').on('click', this._runTests, this);
        content.one("#failed").hide();
        content.one("#passed").hide();

        this.dialogue.set('bodyContent', content);
        this.dialogue.show();
        this.markUpdated();

        this._runTests();
    },

    _runTests: function() {
        var template = Y.Handlebars.compile(TESTTEMPLATE),
            content = null,
            cleaned = null,
            test = null,
            pass = false,
            passes = 0,
            fails = 0,
            msg = null,
            editor = this.get('host'),
            tests = this.get('tests');

        for (var i = 0; i < tests.length; i++) {
            test = tests[i];
            cleaned = '';
            Y.log('Running test ' + i + " - " + test.about, 'debug', LOGNAME);

            try {
                cleaned = editor._cleanHTML(test.input, true);
            } catch (exp) {
                Y.log("Exception thrown", 'debug', LOGNAME);
                Y.log(exp.toString(), 'debug', LOGNAME);
                Y.log(exp.stack, 'debug', LOGNAME);
            }

            if (cleaned == test.expected) {
                pass = true;
                passes++;
            } else {
                pass = false;
                fails++;
            }

            content = Y.Node.create(template({
                about: test.about,
                inputCode: test.input,
                outputCode: cleaned,
                expectedCode: test.expected,
                pass: pass,
                testNumber: i
            }));
            this.dialogue.bodyNode.one("#results").append(content);
        }

        if (fails) {
            msg = fails + ' out of ' + (passes + fails) + ' tests failed!';
            this.dialogue.bodyNode.one("#failed").set('innerHTML', msg);
            this.dialogue.bodyNode.one("#failed").show();
        } else {
            msg = 'All ' + passes + ' tests passed!';
            this.dialogue.bodyNode.one("#passed").set('innerHTML', msg);
            this.dialogue.bodyNode.one("#passed").show();
        }
    },

    _setCode: function(id, code) {
        this.dialogue.bodyNode.one('#' + id).set('innerHTML', Y.Escape.html(code));
    }
}, {
    ATTRS: {
        tests: {
            value: null
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin", "escape"]});
