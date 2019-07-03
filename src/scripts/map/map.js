const createMap = () => {
    const map = new ymaps.Map('map', {
        center: [59.938892, 30.315221],
        zoom: 15,
    })

    return map;
}

const createClusterer = () => {
    const customClusterBalloonContent = ymaps.templateLayoutFactory.createClass(
        `
            <div class="balloon">
                <a href="#">{{ properties.balloonContentHeader|raw }}</a>
                <div class="balloon__body">{{ properties.balloonContentBody|raw }}</div>
                <div class="balloon__footer">{{ properties.balloonContentFooter|raw }}</div>
            </div>
        `
    );

    return new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customClusterBalloonContent,
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 200,
        clusterBalloonPagerSize: 100,
    });
}

export { createMap, createClusterer };