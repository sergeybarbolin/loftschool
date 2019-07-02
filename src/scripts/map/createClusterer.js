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
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 100,
    });
}

export const clusterer = createClusterer();