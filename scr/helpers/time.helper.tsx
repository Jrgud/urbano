

export function formatSecondsToTimeString(seconds:number) {
    // Calcula horas, minutos y segundos
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Formatea cada valor para que tenga siempre dos dígitos
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}



interface Date {
    toDateYearMonthShort(): string;
    toTime(): string;
    toDateTime(): string;
    toTimeShort(): string;
    toDate(): string;
    toDateShort(): string;
    toDateLong(): string;
    toDateHTML(): string;
    toDateTimeHTML(): string;
    toMonthHTML(): string;
    monthFirstDay(): Object;
    monthLastDay(): Object;
    addDays(): Date;
    toDateTimeShort(): string;
    toRelativeFromToday(): string;
    toRelativeFromNow(): string;
    toANSI(): string;
  }


Date.prototype.toDateYearMonthShort = function () {
    return this.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short'
    });
}

Date.prototype.toTime = function () {
    return this.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
Date.prototype.toDateTime = function () {
    return this.toLocaleString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    })+' ' + this.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
Date.prototype.toTimeShort = function () {
    return this.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

Date.prototype.toDate = function () {
    return this.toLocaleString(undefined, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    });
}

Date.prototype.toDateShort = function () {
    return this.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short'
    });
}

Date.prototype.toDateLong = function () {
    return this.toLocaleString(undefined, {
        day: 'numeric',
        month: 'long'
    });
}

Date.prototype.toDateHTML = function () {
    return this.toISOString()
        .substr(0, 10);
}
Date.prototype.toDateTimeHTML = function () {
    return this.toISOString()
        .substr(0, 10) + ' ' + this.toLocaleString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
}
Date.prototype.toMonthHTML = function () {
    return this.toISOString()
        .substr(0, 7);
}

// Date.yesterday = function () {
//     const hoy = new Date();
//     return new Date(hoy.setDate(hoy.getDate() - 1));
// }

// Date.tomorrow = function () {
//     const hoy = new Date();
//     return new Date(hoy.setDate(hoy.getDate() + 1));
// }

Date.prototype.monthFirstDay = function () {
    return new Date(this.getFullYear(), this.getMonth(), 1);
}

// Date.monthFirstDay = function () {
//     const today = new Date();
//     return new Date(today.getFullYear(), today.getMonth(), 1);
// }

Date.prototype.monthLastDay = function () {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0);
}

// Date.monthLastDay = function () {
//     const today = new Date();
//     return new Date(today.getFullYear(), today.getMonth() + 1, 0);
// }

// Date.prototype.addDays = function (days) {
//     days = days || 1;
//     this.setDate(this.getDate() + days);
//     return this;
// }

Date.prototype.toDateTimeShort = function () {
    return this.toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

Date.prototype.toRelativeFromToday = function () {
    let userLocale = navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;
    userLocale = userLocale || 'es';
    const today = new Date();
    const utc_today = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const utc_this = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate());
    const diff = utc_this - utc_today;
    const days = diff / (1000 * 60 * 60 * 24);
    const months = days / 30;
    const years = days / 365;
    return Math.abs(days) < 45
        ? (new Intl.RelativeTimeFormat(userLocale, { style: 'long', numeric: 'auto' })).format(Math.round(days), 'day')
        : Math.abs(months) < 18
            ? (new Intl.RelativeTimeFormat(userLocale, { style: 'long', numeric: 'auto' })).format(Math.round(months), 'month')
            : (new Intl.RelativeTimeFormat(userLocale, { style: 'long', numeric: 'auto' })).format(Math.round(years), 'year')
}

// Date.prototype.toRelativeFromNow = function () {
//     let userLocale = navigator.languages && navigator.languages.length
//         ? navigator.languages[0]
//         : navigator.language;
//     userLocale = userLocale || 'es';

//     const diff = this - new Date(); // diferencia en ms
//     const minutes = diff / (1000 * 60);
//     const hours = minutes / 60;
//     return Math.abs(minutes) < 60
//         ? (new Intl.RelativeTimeFormat(userLocale, { style: 'long', numeric: 'auto' })).format(Math.round(minutes), 'minute')
//         : (new Intl.RelativeTimeFormat(userLocale, { style: 'long', numeric: 'auto' })).format(Math.round(hours), 'hour')
// }

// Date.datediff = function (unit, a, b) {
//     try {
//         // validar tipo de datos de a y b
//         let utc_a, utc_b, diff, result;
//         switch (unit) {
//             case 'year':
//                 utc_a = Date.UTC(a.getFullYear(), 0);
//                 utc_b = Date.UTC(b.getFullYear(), 0);
//                 diff = utc_a - utc_b;
//                 result = Math.ceil(diff / (1000 * 60 * 60 * 24 * 365));
//                 break;
//             case 'month':
//                 utc_a = Date.UTC(a.getFullYear(), a.getMonth());
//                 utc_b = Date.UTC(b.getFullYear(), b.getMonth());
//                 diff = utc_a - utc_b;
//                 result = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
//                 break;
//             case 'day':
//                 utc_a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
//                 utc_b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
//                 diff = utc_a - utc_b;
//                 result = diff / (1000 * 60 * 60 * 24);
//             case 'hour':
//                 utc_a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours());
//                 utc_b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours());
//                 diff = utc_a - utc_b;
//                 result = diff / (1000 * 60 * 60 * 60 * 24);
//             case 'minute':
//                 utc_a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
//                 utc_b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes());
//                 diff = utc_a - utc_b;
//                 result = diff / (1000 * 60 * 60 * 60 * 60 * 24);
//             case 'second':
//                 utc_a = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
//                 utc_b = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), b.getMinutes(), b.getSeconds());
//                 diff = utc_a - utc_b;
//                 result = diff / (1000 * 60 * 60 * 60 * 60 * 60 * 24);
//                 break;
//             default:
//                 result = 0;
//         }
//         return result;
//     } catch (e) {
//         console.warn('Date.datediff: ' + e);
//         return undefined;
//     }
// }

Date.prototype.toANSI = function () {
    const yyyy = this.getFullYear();
    const MM = (this.getMonth() + 1).toString().padStart(2, '0');
    const dd = this.getDate().toString().padStart(2, '0');
    const HH = this.getHours().toString().padStart(2, '0');
    const mm = this.getMinutes().toString().padStart(2, '0');
    const ss = this.getSeconds().toString().padStart(2, '0');
    if (HH === '00' && mm === '00' && ss === '00') {
        return `${yyyy}${MM}${dd}`;
    } else {
        return `${yyyy}${MM}${dd} ${HH}:${mm}:${ss}`;
    }
}
 