<?php
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

/**
 * Atto test library functions.
 *
 * @package    atto_cleantest
 * @copyright  2021 Eric Merrill (merrill@oakland.edu)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Set params for this plugin.
 *
 * @param string $elementid
 * @param stdClass $options - the options for the editor, including the context.
 * @param stdClass $fpoptions - unused.
 */
function atto_cleantest_params_for_js($elementid, $options, $fpoptions) {
    $tests = [
        [
            'input' => '
<li>Something</li>',
            'expected' => '
<ul><li>Something</li></ul>'
        ], [
            'input' => '
<ol class="someClass">
    <li>Something</li>
</ol>',
            'expected' => '
<ol class="someClass">
    <li>Something</li>
</ol>'
        ], [
            'input' => '
    <li>Something 1</li>
    <li>Something 2</li>
</ol>',
            'expected' => '
    <ol><li>Something 1</li>
    <li>Something 2</li>
</ol>'
        ], [
            'input' => '
    <li>Something 1</li>
    <li>Something 2</li>
</ul>',
            'expected' => '
    <ul><li>Something 1</li>
    <li>Something 2</li>
</ul>'
        ], [
            'input' => '
<p>Something before</p>
<li>A</li>
<li>B</li>
<p>Something after</p>',
            'expected' => '
<p>Something before</p>
<ul><li>A</li>
<li>B</li></ul>
<p>Something after</p>'
        ], [
            'input' => '
<ul>
    <li>Something 1</li>
    <li>Something 2
</ul>',
            'expected' => '
<ul>
    <li>Something 1</li>
    <li>Something 2
</li></ul>'
        ], [
            'input' => '
<ul>
    <li>Something 1</li>
    <li>Something 2
    <li>Something 3</li>
</ul>',
            'expected' => '
<ul>
    <li>Something 1</li>
    <li>Something 2
    </li><li>Something 3</li>
</ul>'
        ], [
            'input' => '
<li>Something 1</li>
<li>Something 2',
            'expected' => '
Something 1
Something 2'
        ], [
            'input' => '
<ul>
    <li>Something 1<li>Something 3</li></li>
    <li>Something 2</li>
</ul>',
            'expected' => '
<ul>
    <li>Something 1</li><li>Something 3</li>
    <li>Something 2</li>
</ul>'
        ], [
            'input' => '
<ul>
    <li>Something 1
    <li>Something 3</li></li>
    <li>Something 2</li>
</ul>',
            'expected' => '
<ul>
    <li>Something 1
    </li><li>Something 3</li>
    <li>Something 2</li>
</ul>'
        ], [
            'input' => '
<p>Something before</p>
<ul>
    <li>A</li>
    <ol>
        <li>1</li>
        <li>2</li>
    </ol>
    <li>B</li>
<p>Something after</p>',
            'expected' => '
<p>Something before</p>
<ul>
    <li>A</li>
    <ol>
        <li>1</li>
        <li>2</li>
    </ol>
    <li>B</li></ul>
<p>Something after</p>'
        ], [
            'input' => '
<p>Something before</p>
<ul>
    <li>A</li>
    <ol>
        <li>1</li>
        <li>2</li>
    <li>B</li>
<p>Something after</p>',
            'expected' => '
<p>Something before</p>
<ul>
    <li>A</li></ul>
    <ol>
        <li>1</li>
        <li>2</li>
    <li>B</li></ol>
<p>Something after</p>'
        ], [
            'input' => '
<p>Something before</p>
<ul>
    <ol>
        <li>1</li>
        <li>2</li>
<p>Something after</p>',
            'expected' => '
<p>Something before</p>

    <ol>
        <li>1</li>
        <li>2</li></ol>
<p>Something after</p>'
        ], [
            'input' => '
<div class="li">
    &lt;li&gt;
    &lt;ul&gt;
    &lt;ol&gt;
</div>',
            'expected' => '
<div class="li">
    &lt;li&gt;
    &lt;ul&gt;
    &lt;ol&gt;
</div>'
        ], [
            'input' => '
',
            'expected' => '
'
        ], [
            'input' => '
',
            'expected' => '
'
        ], [
            'input' => '
',
            'expected' => '
'
        ]
    ];

    // Strip of starting new lines
    $tests = array_map(function($test) {
            return ['input' => substr($test['input'], 1), 'expected' => substr($test['expected'], 1)];
    }, $tests);

    return ['tests' => $tests];

}

/**
 * Initialise the js strings required for this module.
 */
function atto_cleantest_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(array('pluginname'), 'atto_cleantest');
}
