import axios from 'axios';
import qs from 'qs';

import flexible from './flexible';

export const Rem = option => {
    const _option = {
        remUnit: 75,
        remPrecision: 6,
    };

    option = Object.assign({}, _option, option)

    return x => {
        return parseFloat((x / option.remUnit).toFixed(option.remPrecision)).toString() + 'rem'
    }
}

export const rem = Rem({remUnit: 108});

export const px = x => (''+(!flexible.hairlines && x < 1 ? 1 : x)+'px');

export const request = async (url, params) => {
    const {data: {success = false, payload = null, message = null}} = await axios.post(url, qs.stringify(params));
    if (!success) {
        throw message;
    }
    return payload;
}

export const env = x => {
    const match = x => navigator.userAgent.match(x) !== null;
    const matchs = {
        'WEIXIN': () => match('MicroMessenger'),
        'ANFENG_HELPER': () => match('anfan'),
        'ANFENG_GAME': () => match('afgame'),
        'ANFENG_SDK_ANDROID': () => match('anfeng_mobile_android_sdk'),
        'ANFENG_SDK_IOS': () => match('anfeng_mobile_ios_sdk'),
        'IOS': () => match(/iphone|ipod|ipad/ig),
    }
    return matchs[x] ? matchs[x]() : false;
}