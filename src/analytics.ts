import * as $ from 'jquery' //подключаем jquery

function createAnalytics(): object {
    let counter = 0
    let destroyed = false

    const listener = (): number =>   counter ++

    $(document).on('click', listener)
    return {
        destroy() {
            $(document).off('click', listener)
            destroyed = true
        },
        getClicks() {
            if(destroyed) {
                return 'Analytics is destroyed'
            }
            return counter
        }
    }
}

window['analytics'] = createAnalytics()