"use strict";

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSpeedInKmh(val) {
    return Math.abs(Math.round(val * 1000 / 2));
}

function MacroCollision(obj1, obj2) {
    var XColl = false;
    var YColl = false;
    if ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width)) {
        XColl = true;
    }
    if ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height)) {
        YColl = true;
    }
    return (XColl && YColl);
}