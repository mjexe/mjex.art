// angle.js <https://github.com/davidfig/anglejs>
// Released under MIT license <https://github.com/davidfig/angle/blob/master/LICENSE>
// Author: David Figatner
// Copyright (c) 2016-17 YOPEY YOPEY LLC

var _toDegreeConversion = 180 / Math.PI
var _toRadianConversion = Math.PI / 180

/** @constant {number} */
var UP = Math.PI / 2
var DOWN = 3 * Math.PI / 2
var LEFT = Math.PI
var RIGHT = 0

var NORTH = UP
var SOUTH = DOWN
var WEST = LEFT
var EAST = RIGHT

var PI_2 = Math.PI * 2
var PI_QUARTER = Math.PI / 4
var PI_HALF = Math.PI / 2

/**
 * converts from radians to degrees (all other functions expect radians)
 * @param {number} radians
 * @return {number} degrees
 */
function toDegrees(radians)
{
    return radians * _toDegreeConversion
}

/**
 * converts from degrees to radians (all other functions expect radians)
 * @param {number} degrees
 * @return {number} radians
 */
function toRadians(degrees)
{
    return degrees * _toRadianConversion
}

/**
 * returns whether the target angle is between angle1 and angle2 (in radians)
 * (based on: http://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles)
 * @param {number} target angle
 * @param {number} angle1
 * @param {number} angle2
 * @return {boolean}
 */
function isAngleBetween(target, angle1, angle2)
{
    var rAngle = ((angle2 - angle1) % PI_2 + PI_2) % PI_2
    if (rAngle >= Math.PI)
    {
        var swap = angle1
        angle1 = angle2
        angle2 = swap
    }

    if (angle1 <= angle2)
    {
        return target >= angle1 && target <= angle2
    }
    else
    {
        return target >= angle1 || target <= angle2
    }
}

/**
 * returns +1 or -1 based on whether the difference between two angles is positive or negative (in radians)
 * @param {number} target angle
 * @param {number} source angle
 * @return {number} 1 or -1
 */
function differenceAnglesSign(target, source)
{
    function mod(a, n)
    {
        return (a % n + n) % n
    }

    var a = target - source
    return mod((a + Math.PI), PI_2) - Math.PI > 0 ? 1 : -1
}

/**
 * returns the normalized difference between two angles (in radians)
 * @param {number} a - first angle
 * @param {number} b - second angle
 * @return {number} normalized difference between a and b
 */
function differenceAngles(a, b)
{
    var c = Math.abs(a - b) % PI_2
    return c > Math.PI ? (PI_2 - c) : c
}

/**
 * returns a target angle that is the shortest way to rotate an object between start and to--may choose a negative angle
 * @param {number} start
 * @param {number} to
 * @return {number} shortest target angle
 */
function shortestAngle(start, to)
{
    var difference = differenceAngles(to, start)
    var sign = differenceAnglesSign(to, start)
    var delta = difference * sign
    return delta + start
}

/**
 * returns the normalized angle (0 - PI x 2)
 * @param {number} radians
 * @return {number} normalized angle in radians
 */
function normalize(radians)
{
    return radians - PI_2 * Math.floor(radians / PI_2)
}

/**
 * returns angle between two points (in radians)
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} angle
 */
function angleTwoPoints(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 4)
    {
        return Math.atan2(arguments[3] - arguments[1], arguments[2] - arguments[0])
    }
    else
    {
        return Math.atan2(arguments[1].y - arguments[0].y, arguments[1].x - arguments[0].x)
    }
}

/**
 * returns distance between two points
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} distance
 */
function distanceTwoPoints(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 2)
    {
        return Math.sqrt(Math.pow(arguments[1].x - arguments[0].x, 2) + Math.pow(arguments[1].y - arguments[0].y, 2))
    }
    else
    {
        return Math.sqrt(Math.pow(arguments[2] - arguments[0], 2) + Math.pow(arguments[3] - arguments[1], 2))
    }
}

/**
 * returns the squared distance between two points
 * @param {Point} [point1] {x: x, y: y}
 * @param {Point} [point2] {x: x, y: y}
 * @param {number} [x1]
 * @param {number} [y1]
 * @param {number} [x2]
 * @param {number} [y2]
 * @return {number} squared distance
 */
function distanceTwoPointsSquared(/* (point1, point2) OR (x1, y1, x2, y2) */)
{
    if (arguments.length === 2)
    {
        return Math.pow(arguments[1].x - arguments[0].x, 2) + Math.pow(arguments[1].y - arguments[0].y, 2)
    }
    else
    {
        return Math.pow(arguments[2] - arguments[0], 2) + Math.pow(arguments[3] - arguments[1], 2)
    }
}

/**
 * returns the closest cardinal (N, S, E, W) to the given angle (in radians)
 * @param {number} angle
 * @return {number} closest cardinal in radians
 */
function closestAngle(angle)
{
    var left = differenceAngles(angle, LEFT)
    var right = differenceAngles(angle, RIGHT)
    var up = differenceAngles(angle, UP)
    var down = differenceAngles(angle, DOWN)
    if (left <= right && left <= up && left <= down)
    {
        return LEFT
    }
    else if (right <= up && right <= down)
    {
        return RIGHT
    }
    else if (up <= down)
    {
        return UP
    }
    else
    {
        return DOWN
    }
}

/**
 * checks whether angles a1 and a2 are equal (after normalizing)
 * @param {number} a1
 * @param {number} a2
 * @param {number} [wiggle] return true if the difference between the angles is <= wiggle
 * @return {boolean} a1 === a2
 */
function equals(a1, a2, wiggle)
{
    if (wiggle)
    {
        return differenceAngles(a1, a2) < wiggle
    }
    else
    {
        return normalize(a1) === normalize(a2)
    }
}

/**
 * return a text representation of the cardinal direction
 * @param {number} angle
 * @returns {string} UP, DOWN, LEFT, RIGHT, or NOT CARDINAL
 */
function explain(angle)
{
    switch (angle)
    {
        case UP: return 'UP'
        case DOWN: return 'DOWN'
        case LEFT: return 'LEFT'
        case RIGHT: return 'RIGHT'
        default: return 'NOT CARDINAL'
    }
}
