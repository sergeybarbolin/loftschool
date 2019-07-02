const displayPopup = (popup, mapWrapper, position, map) => {
    
    const positionCenter = map.getGlobalPixelCenter();

    const offsetTop = position.y + popup.offsetHeight - window.innerHeight;
    const offsetRight = position.x + popup.offsetWidth - window.innerWidth;
    let newPositionY = (offsetTop > 0) ? positionCenter[1] + 20 + offsetTop : positionCenter[1];
    let newPositionX = (offsetRight > 0) ? positionCenter[0] + 20 + offsetRight : positionCenter[0]

    console.log(position.y, offsetTop);
    popup.style.top = (offsetTop > 0) ? position.y - offsetTop - 25 + 'px' : position.y + 5 + 'px';
    popup.style.left = (offsetRight > 0) ? position.x - offsetRight - 25 + 'px' : position.x + 5 + 'px';

    map.setGlobalPixelCenter([newPositionX, newPositionY]);
    popup.classList.add('popup--visible');

    return true;
}