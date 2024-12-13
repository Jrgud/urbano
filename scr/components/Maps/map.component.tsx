import MonitorProperties from '../../assets/js/map.js';
import { FLEETS_MAP } from "../providers/fm-fltm.provider.js";
import "./../../helpers/time.helper"
class Map {
    container = "";
    db = {
        positionTourEquipment: [],
        equipmentTouring: { code: 'Vol-402' },
        setDataPolygon: [],
        material: [],
        placeShift: [],
    }
    marker = new mapboxgl.Marker({
        color: '#405188', // color it red
    });
    alert = Swal.mixin({
        buttonsStyling: false,
        customClass: {
            cancelButton: 'btn btn-light mx-3',
            confirmButton: 'btn btn-primary mx-3',
        }
    })
    drawPolygon = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true,
            point: false,
            line_string: false,
            combine_features: false,
            uncombine_features: false
        },
        keybindings: false,
        touchEnabled: false,
        //defaultMode: 'draw_polygon'
        //modes: Object.assign({
        //    lots_of_points: LotsOfPointsMode,
        //}, MapboxDraw.modes),
    });
    divTourEquipment = null;

    init = 0;
    endTour;
    dateTimeTour = [];
    tour = [];
    touring = false;
    tourActive = false;


    positionTouring = null;
    dateTouring = '26/08/2023';
    idTurnTour = 1;
    constructor(data) {
        this.divTourEquipment = document.getElementById('contentTourEquipment')
        this.initPage()
        this.render();
        this.settings = Object.assign({
            onReady: () => {
                data.onReady();
            }
        }, data);
        this.container = data.container;
        this.generateDetailTour();
        this.events();
    }
    async initPage() {
        this.css();
        await this.getInitDataMap();
    }
    showInformationEquipment = (idEquipment) => void 0;
    showMessageEquipment = (idEquipment) => void 0;
    showHistoryChangeEqupment = (idEquipment) => void 0;
    showTransactionViewer = (idEquipment) => void 0;
    showProductivityEquipment = (idEquipment) => void 0;
    render() {
    }
    css() {
        const css = document.createElement("style");
        css.id = 'map-equipment';
        css.textContent = ` 
        .cardDescriptionPlace:after {
            content: "";
            position: absolute;
            border: 6px solid transparent;
            transform: rotate(90deg);
            border-left-color: #ffffff;
            left:50%;
            top:100%;
        }
        .mapboxgl-popup-content{
            min-width: 300px !important;
            padding:0px !important;
            border:none !important;
            box-shadow:none!important;
        }
        .mapboxgl-popup-close-button{
            display:none !important;
        }
        #main-map{
            width: 100%;
            background: #fff;
            height: 100%;
        }
        .mapboxgl-popup-tip {
            display:none;
        }
        .mapboxgl-popup-content {
            background: none !important;
        }
        .menu-item,
        .menu-open-button {
           background: #EEEEEE;
           border-radius: 100%;
           width: 80px;
           height: 80px;
           margin-left: -40px;
           position: absolute;
           color: #FFFFFF;
           text-align: center;
           line-height: 80px;
           -webkit-transform: translate3d(0, 0, 0);
           transform: translate3d(0, 0, 0);
           -webkit-transition: -webkit-transform ease-out 200ms;
           transition: -webkit-transform ease-out 200ms;
           transition: transform ease-out 200ms;
           transition: transform ease-out 200ms, -webkit-transform ease-out 200ms;
        }
        
        .menu-open {
           display: none;
        }
        
        .lines {
           width: 25px;
           height: 3px;
           background: #596778;
           display: block;
           position: absolute;
           top: 50%;
           left: 50%;
           margin-left: -12.5px;
           margin-top: -1.5px;
           -webkit-transition: -webkit-transform 200ms;
           transition: -webkit-transform 200ms;
           transition: transform 200ms;
           transition: transform 200ms, -webkit-transform 200ms;
        }
        
        .line-1 {
           -webkit-transform: translate3d(0, -8px, 0);
           transform: translate3d(0, -8px, 0);
        }
        
        .line-2 {
           -webkit-transform: translate3d(0, 0, 0);
           transform: translate3d(0, 0, 0);
        }
        
        .line-3 {
           -webkit-transform: translate3d(0, 8px, 0);
           transform: translate3d(0, 8px, 0);
        }
        
        .menu-open:checked + .menu-open-button .line-1 {
           -webkit-transform: translate3d(0, 0, 0) rotate(45deg);
           transform: translate3d(0, 0, 0) rotate(45deg);
        }
        
        .menu-open:checked + .menu-open-button .line-2 {
           -webkit-transform: translate3d(0, 0, 0) scale(0.1, 1);
           transform: translate3d(0, 0, 0) scale(0.1, 1);
        }
        
        .menu-open:checked + .menu-open-button .line-3 {
           -webkit-transform: translate3d(0, 0, 0) rotate(-45deg);
           transform: translate3d(0, 0, 0) rotate(-45deg);
        }
        
        .menu {
           margin: auto;
           position: absolute;
           top: 0;
           bottom: 0;
           left: 0;
           right: 0;
           width: 80px;
           height: 80px;
           text-align: center;
           box-sizing: border-box;
           font-size: 26px;
        }
        
        
        /* .menu-item {
           transition: all 0.1s ease 0s;
        } */
        
        .menu-item:hover {
           background: #EEEEEE;
           color: #3290B1;
        }
        
        .menu-item:nth-child(3) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(4) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(5) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(6) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(7) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(8) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-item:nth-child(9) {
           -webkit-transition-duration: 180ms;
           transition-duration: 180ms;
        }
        
        .menu-open-button {
           z-index: 2;
           -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
           transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
           -webkit-transition-duration: 400ms;
           transition-duration: 400ms;
           -webkit-transform: scale(1.1, 1.1) translate3d(0, 0, 0);
           transform: scale(1.1, 1.1) translate3d(0, 0, 0);
           cursor: pointer;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
        }
        
        .menu-open-button:hover {
           -webkit-transform: scale(1.2, 1.2) translate3d(0, 0, 0);
           transform: scale(1.2, 1.2) translate3d(0, 0, 0);
        }
        
        .menu-open:checked + .menu-open-button {
           -webkit-transition-timing-function: linear;
           transition-timing-function: linear;
           -webkit-transition-duration: 200ms;
           transition-duration: 200ms;
           -webkit-transform: scale(0.8, 0.8) translate3d(0, 0, 0);
           transform: scale(0.8, 0.8) translate3d(0, 0, 0);
        }
        
        .menu-open:checked ~ .menu-item {
           -webkit-transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
           transition-timing-function: cubic-bezier(0.935, 0, 0.34, 1.33);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(3) {
           transition-duration: 180ms;
           -webkit-transition-duration: 180ms;
           -webkit-transform: translate3d(0.08361px, -104.99997px, 0);
           transform: translate3d(0.08361px, -104.99997px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(4) {
           transition-duration: 280ms;
           -webkit-transition-duration: 280ms;
           -webkit-transform: translate3d(90.9466px, -52.47586px, 0);
           transform: translate3d(90.9466px, -52.47586px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(5) {
           transition-duration: 380ms;
           -webkit-transition-duration: 380ms;
           -webkit-transform: translate3d(90.9466px, 52.47586px, 0);
           transform: translate3d(90.9466px, 52.47586px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(6) {
           transition-duration: 480ms;
           -webkit-transition-duration: 480ms;
           -webkit-transform: translate3d(0.08361px, 104.99997px, 0);
           transform: translate3d(0.08361px, 104.99997px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(7) {
           transition-duration: 580ms;
           -webkit-transition-duration: 580ms;
           -webkit-transform: translate3d(-90.86291px, 52.62064px, 0);
           transform: translate3d(-90.86291px, 52.62064px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(8) {
           transition-duration: 680ms;
           -webkit-transition-duration: 680ms;
           -webkit-transform: translate3d(-91.03006px, -52.33095px, 0);
           transform: translate3d(-91.03006px, -52.33095px, 0);
        }
        
        .menu-open:checked ~ .menu-item:nth-child(9) {
           transition-duration: 780ms;
           -webkit-transition-duration: 780ms;
           -webkit-transform: translate3d(-0.25084px, -104.9997px, 0);
           transform: translate3d(-0.25084px, -104.9997px, 0);
        }
        
        .blue {
           background-color: #669AE1;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .blue:hover {
           color: #669AE1;
           text-shadow: none;
        }
        
        .green {
           background-color: #70CC72;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .green:hover {
           color: #70CC72;
           text-shadow: none;
        }
        
        .red {
           background-color: #FE4365;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .red:hover {
           color: #FE4365;
           text-shadow: none;
        }
        
        .purple {
           background-color: #C49CDE;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .purple:hover {
           color: #C49CDE;
           text-shadow: none;
        }
        
        .orange {
           background-color: #FC913A;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .orange:hover {
           color: #FC913A;
           text-shadow: none;
        }
        
        .lightblue {
           background-color: #62C2E4;
           box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.14);
           text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.12);
        }
        
        .lightblue:hover {
           color: #62C2E4;
           text-shadow: none;
        }
        
        .credit {
           margin: 24px 20px 120px 0;
           text-align: right;
           color: #EEEEEE;
        }
        
        .credit a {
           padding: 8px 0;
           color: #C49CDE;
           text-decoration: none;
           transition: all 0.3s ease 0s;
        }
        
        .credit a:hover {
           text-decoration: underline;
        }`;
        document.head.appendChild(css);
    }
    events() {
        const btnChangePolygonMap = document.querySelector('#changePolygonMap');
        btnChangePolygonMap.addEventListener('click', e => {
            if (this.db.setDataPolygon.length > 0) {
                let tramaPlaceShift = '', tramaPlacePolygonShift = '';
                tramaPlaceShift = this.db.setDataPolygon.map(k => {
                    //debugger
                    console.log(k.materialPlace)
                    return '^' + k.placeShiftId + '|' + (Boolean(Date.parse(k.date)) ? k.date.toANSI() : k.date) + '|' + k.shiftId + '|' + k.placeId + '|' + k.colorPlaceShift + '|' + k.descriptionPlace + '|' + k.typePlaceId + '|' + (Array.isArray(k.materialPlace) ? k.materialPlace.map(k => k.materialId).join(',') : JSON.parse(k.materialPlace).map(k => k.materialId).join(','));
                }).join('').substring(1);
                this.db.setDataPolygon.map(k => {
                    tramaPlacePolygonShift += k.coord.map(p => '^' + p.placeShiftId + '|' + p.order + '|' + p.longitude + '|' + p.latitude + '|' + p.elevation).join('');
                });
                tramaPlacePolygonShift = tramaPlacePolygonShift.substring(1);

                //console.log(tramaPlaceShift);
                //console.log(tramaPlaceShift);
                //debugger
                let dateTurn = document.querySelector("#inputDateManagement").value.split('-').join('');
                let shiftTurn = document.querySelector("#selectShiftManagement").value;
                this.updatePolygonData(dateTurn, shiftTurn, tramaPlaceShift, tramaPlacePolygonShift);
            }
        });

        //const btnUpdatePolylineGeocercas = document.querySelector('#btnUpdatePolylineGeocercas');//Show Modal Geocerca
        const btnCloseEditingPolylineGeocerca = document.querySelector('#btnCloseEditingPolylineGeocerca');//Close Modal Geocerca
        //const changePolylineGeocerca = document.querySelector('#changePolylineGeocerca');//select Geocercas 
        const btnSavePointsPolylineGeocerca = document.querySelector('#btnSavePointsPolylineGeocerca');
        //btnUpdatePolylineGeocercas.addEventListener('click',e=> {
        //    document.querySelector('#editing-polyline-geocerca').classList.remove('d-none');
        //    if (this.db.setDataPolygon.length > 0) {
        //        changePolylineGeocerca.innerHTML = this.db.setDataPolygon.map(k => ` <option value="${k.placeId}">${k.descriptionPlace}</option>`).join('');
        //    }
        //})
        btnCloseEditingPolylineGeocerca.addEventListener('click', e => {
            document.querySelector('#editing-polyline-geocerca').classList.add('d-none');
            if (this.db.setDataPolygon.length > 0) {
                this.drawPolygon.deleteAll();
                this.mapFleet.setData = {
                    entityType: 'place',
                    nameLayer: 'place-polygons',
                    data: [this.db.setDataPolygon],
                }
            }
        });
        //btnSavePointsPolylineGeocerca.addEventListener('click', e => {
        //    if (this.db.setDataPolygon.length > 0) {
        //        let data = this.drawPolygon.getAll();
        //        let polygon = data.features[0];
        //        this.drawPolygon.deleteAll();
        //        polygon.properties.coord = polygon.geometry.coordinates[0].map((k, i) => {
        //            return {
        //                placeShiftId: polygon.properties.placeShiftId, order: i, longitude: k[0], latitude: k[1], elevation: 0
        //            }
        //        });
        //        let dateTurn = document.querySelector("#inputDateManagement").value.split('-').join('');
        //        polygon.properties.date = dateTurn;
        //        this.db.setDataPolygon = this.db.setDataPolygon.filter(f => f.placeShiftId != document.querySelector('#namePolygonGeocerca').dataset.id)
        //        this.db.setDataPolygon.push(polygon.properties);
        //        this.mapFleet.setData = {
        //            entityType: 'place',
        //            nameLayer: 'place-polygons',
        //            data: [this.db.setDataPolygon],
        //        }
        //        this.alert.fire('¡Cambios actualizados localmente!', '', 'success'); 
        //    }

        //});

    }
    drawMapPolygon() {
        const updateArea = (e) => {
            const feature = e.features[0];
            const data = this.drawPolygon.getAll();
            console.log(e);
            console.log(feature);
            console.log(data);

            const answer = document.getElementById('calculated-area-polygon');
            const editingPolygon = document.getElementById('editing-area-polygon');
            if (data.features.length > 0) {
                const area = turf.area(data);
                // Restrict the area to 2 decimal points.
                const rounded_area = Math.round(area * 100) / 100;
                answer.innerHTML = `<strong>${rounded_area}</strong></p><p>M2 meters`;
                editingPolygon.innerHTML = `editando`;
            } else {
                answer.innerHTML = '';
                editingPolygon.innerHTML = `editado`;
                if (e.type !== 'draw.delete')
                    alert('Click the map to draw a polygon.');
            }
        }
        this.mapFleet.map.addControl(this.drawPolygon, 'top-left');

        this.mapFleet.map.on('draw.create', e => {
            let data = this.drawPolygon.getAll();
            let polygon = data.features[0];
            this.drawPolygon.deleteAll();
            polygon.properties.placeShiftId = data.features[0].id;
            polygon.properties.colorPlaceShift = "#303021";

            let dateTurn = document.querySelector("#inputDateManagement").value.split('-').join('');
            let shiftTurn = document.querySelector("#selectShiftManagement").value;


            polygon.properties.date = dateTurn;
            polygon.properties.shiftId = shiftTurn;
            polygon.properties.placeId = 0;
            polygon.properties.typePlaceId = 6;
            polygon.properties.materialPlace = [];
            polygon.properties.descriptionPlace = 'Nueva Geocerca';

            polygon.properties.coord = polygon.geometry.coordinates[0].map((k, i) => {
                return {
                    placeShiftId: data.features[0].id, order: i, longitude: k[0], latitude: k[1], elevation: 0
                }
            })
            this.db.setDataPolygon.push(polygon.properties);
            //console.log(this.db.setDataPolygon);
            this.mapFleet.setData = {
                entityType: 'place',
                nameLayer: 'place-polygons',
                data: [this.db.setDataPolygon],
            }

        });
        this.mapFleet.map.on('draw.delete', e => {
            this.drawPolygon.deleteAll();
            this.db.setDataPolygon = this.db.setDataPolygon.filter(f => f.placeShiftId != e.features[0].properties.placeShiftId)
            this.mapFleet.setData = {
                entityType: 'place',
                nameLayer: 'place-polygons',
                data: [this.db.setDataPolygon],
            }

        });
        this.mapFleet.map.on('draw.update', e => {
            let data = this.drawPolygon.getAll();
            let polygon = data.features[0];
            //this.drawPolygon.deleteAll();
            polygon.properties.coord = polygon.geometry.coordinates[0].map((k, i) => {
               return {
                   placeShiftId: polygon.properties.placeShiftId, order: i, longitude: k[0], latitude: k[1], elevation: 0
               }
            });
            let dateTurn = document.querySelector("#inputDateManagement").value.split('-').join('');
            polygon.properties.date = dateTurn;
            this.db.setDataPolygon = this.db.setDataPolygon.filter(f => f.placeShiftId != e.features[0].properties.placeShiftId)
            this.db.setDataPolygon.push(polygon.properties);
            this.mapFleet.setData = {
               entityType: 'place',
               nameLayer: 'place-polygons',
               data: [this.db.setDataPolygon],
            }

        });

    }

    mapConfiguration() {
        this.mapFleet = new MonitorProperties({
            container: document.querySelector('#' + this.container),
            onReady: () => {
                this.settings.onReady();
            }
        });
        this.drawMapPolygon();

        this.mapFleet.map.on('click', (e) => {
             console.log(`lat: ${e.lngLat.lat}, lng: ${e.lngLat.lng}`)
        });

        this.mapFleet.map.on('click', "lyr-fleet-symbols", (e) => {
            //console.log(e.features[0]);
            const coordinates = e.features[0].geometry.coordinates.slice();
            while (Math.abs(e.lngLat.lng - coordinates[0][0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0][0] ? 360 : -360;
            }
            const data = e.features[0].properties;
            const reportId = e.features[0].properties.reportId;
            const popupEquipment = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    `<nav class="menu">
                        <input type="checkbox" href="#" class="menu-open " name="menu-open" id="menu-open"  disabled/>
                        <label class="menu-open-button btnClosePopupEquipment" for="menu-open">
                         <span class="lines line-1"></span>
                         <span class="lines line-2"></span>
                         <span class="lines line-3"></span>
                       </label>
                     
                        <a data-command='travel-equipment'  data-id-equipment="${reportId}"    class="menu-item blue ">
                            <i class="ri-pin-distance-line"></i>
                        </a>
                        <a data-command= 'info-equipment' data-id-equipment="${reportId}"  class="menu-item green ">
                            <i class="ri-information-line"></i>
                        </a>
                        <a data-command="productivity-equipment" data-id-equipment="${reportId}" class="menu-item red">
                            <i class="ri-settings-fill"></i>
                        </a>
                        <a data-command="transaction-viewer" data-id-equipment="${reportId}" class="menu-item purple">
                            <i class="ri-alert-line"></i>
                        </a>
                        <a data-command="history-change-equipment" data-id-equipment="${reportId}" class="menu-item orange">
                            <i class="ri-chat-history-line"></i>
                        </a>
                        <a data-command='message-equipment' data-id-equipment="${reportId}"  class="menu-item lightblue " >
                            <i class="ri-message-3-line"></i>
                        </a>
                     </nav>`
                ).addTo(this.mapFleet.map);
            document.getElementById('menu-open').setAttribute('checked', '');
            const commanndsEquipment = document.querySelectorAll('a[data-command]');
            commanndsEquipment.forEach(btn => {
                btn.addEventListener('click', event => {
                    switch (btn.dataset.command) {
                        case 'travel-equipment':
                            this.showDatailsTour(data);
                            break;
                        case 'info-equipment':
                            this.showInformationEquipment(+btn.dataset.idEquipment);
                            break;
                        case 'message-equipment':
                            this.showMessageEquipment(+btn.dataset.idEquipment);
                            break;
                        case 'history-change-equipment':
                            this.showHistoryChangeEqupment(+btn.dataset.idEquipment);
                            break;
                        case 'transaction-viewer':
                            this.showTransactionViewer(+btn.dataset.idEquipment);
                            break;
                        case 'productivity-equipment':
                            this.showProductivityEquipment(+btn.dataset.idEquipment);
                            break;
                    }

                });
            });

            const btnClosePopup = document.querySelector('.btnClosePopupEquipment');
            btnClosePopup.addEventListener('click', e => {
                //console.log(btnClosePopup)
                document.getElementById('menu-open').removeAttribute('checked');
                setTimeout(() => popupEquipment.remove(), 600)
                //popupEquipment.remove()
            });
        });

        this.mapFleet.map.on('mouseenter', 'lyr-fleet-symbols', () => {
            this.mapFleet.map.getCanvas().style.cursor = 'pointer';
        });

        this.mapFleet.map.on('mouseleave', 'lyr-fleet-symbols', () => {
            this.mapFleet.map.getCanvas().style.cursor = '';
        });
        //this.layer3D();

        this.mapFleet.map.on('contextmenu', "lyr-place-polygons", (e) => {
            //console.log('polygon', e.features[0]['geometry']['coordinates'])
            const properties = e.features[0].properties;
            const htmlContentGeocerca = ` <div class="alert  justify-content-end">
                                             <div class="col-12">
                                                 <div>
                                                     <label for="basiInput" class="form-label">Nombre Lugar</label>
                                                     <input type="text" id="namePlaceShiftId" class="form-control" id="basiInput" value="${properties.descriptionPlace}">
                                                 </div>
                                             </div>
                                             <div class="col-12" >
                                                 <label for="basiInput" class="form-label">Tipo Lugar</label>
                                                 <select class="form-select mb-3" id="typePlaceShiftId"  >
                                                     ${this.db.placeShift.map(k => `<option ${k.typePlaceId == properties.typePlaceId ? 'selected' : ''}   value="${k.typePlaceId}" style="border:solid 2px ${k.color}" classa="rounded rounded-2" >${k.descrition}</option>`).join('')}
                                                 </select>
                                             </div>
                                             <div class="col-12" id="showContentMaterials">
                                                 <label for="basiInput" class="form-label">Materiales</label>
                                                 <select class="form-select mb-3" id="placeMaterialIds"  multiple="multiple"> </select>
                                             </div>
                                             <div class="col-6">
                                                 <button  type="buttton" class="btn btn-success savePlaceanTypePlace">Guardar</buttton>
                                             </div>
                                          </div>  `;

            //const popupPlace = new mapboxgl.Popup()
            //    .setLngLat(e.lngLat)
            //    .setHTML(htmlContentGeocerca).addTo(this.mapFleet.map); 
            document.querySelector('#contentEdittingPolygonGeocercas').innerHTML = htmlContentGeocerca;
            document.querySelector('#editing-polyline-geocerca').classList.remove('d-none');
            document.querySelector('#namePolygonGeocerca').value = e.features[0].properties.descriptionPlace;
            document.querySelector('#namePolygonGeocerca').dataset.id = e.features[0].properties.placeShiftId;
            this.mapFleet.setData = {
                entityType: 'place',
                nameLayer: 'place-polygons',
                data: [this.db.setDataPolygon.filter(f => f.placeShiftId != e.features[0].properties.placeShiftId)],
            }
            this.drawPolygon.add(e.features[0]);


            // select múltiple volquetes
            let $selecMaterial = $(`#placeMaterialIds`);
            $selecMaterial.select2({
                placeholder: "Seleccione los materiales",
            });

            if (!properties.destination) document.querySelector(`#showContentMaterials`).classList.add('d-none');
            const dataMaterial = Boolean(properties.materialPlace) ? JSON.parse(properties.materialPlace) : [];
            const typePlaceShiftChange = document.querySelector('#typePlaceShiftId');
            typePlaceShiftChange.addEventListener('change', e => {
                if (!this.db.placeShift.find(f => f.typePlaceId == typePlaceShiftChange.value).destination) {
                    document.querySelector(`#showContentMaterials`).classList.add('d-none');
                    $selecMaterial.val([]).trigger('change');
                } else {
                    document.querySelector(`#showContentMaterials`).classList.remove('d-none');
                    $selecMaterial.val(dataMaterial.map(k => k.materialId)).trigger('change');
                }
            });

            const material = this.db.material;

            material.forEach(function (obj) {
                let nuevaOpcion = new Option(obj.description, obj.materialId);
                $selecMaterial.append(nuevaOpcion);
            });
            $selecMaterial.trigger('change.select2');

            this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).materialPlace = dataMaterial;

            $selecMaterial.val(dataMaterial.map(k => k.materialId)).trigger('change');

            $selecMaterial.on('change', ($selectDestination) => {
                if (Boolean($selecMaterial.added)) {
                    this.validationSameTipper($selecMaterial.added, x.materialId);
                }
            });
            document.querySelector('.savePlaceanTypePlace').addEventListener('click', e => {
                console.log(this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId));
                this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).typePlaceId = document.querySelector('#typePlaceShiftId').value;
                this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).descriptionPlace = document.querySelector('#namePlaceShiftId').value;
                this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).materialPlace = $selecMaterial.select2("data").map(k => { return { materialId: k.id, description: k.text } });

                //console.log($selecMaterial.select2("data"))
                //console.log(this.db.setDataPolygon)

                //this.mapFleet.setData = {
                //    entityType: 'place',
                //    nameLayer: 'place-polygons',
                //    data: [this.db.setDataPolygon],
                //}



                let data = this.drawPolygon.getAll();
                let polygon = data.features[0];
                this.drawPolygon.deleteAll();
                this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).coord = polygon.geometry.coordinates[0].map((k, i) => {
                    return {
                        placeShiftId: polygon.properties.placeShiftId, order: i, longitude: k[0], latitude: k[1], elevation: 0
                    }
                });
                this.db.setDataPolygon.find(f => f.placeShiftId == properties.placeShiftId).date = document.querySelector("#inputDateManagement").value.split('-').join('');
                //this.db.setDataPolygon = this.db.setDataPolygon.filter(f => f.placeShiftId != document.querySelector('#namePolygonGeocerca').dataset.id)
                //this.db.setDataPolygon.push(polygon.properties);
                this.mapFleet.setData = {
                    entityType: 'place',
                    nameLayer: 'place-polygons',
                    data: [this.db.setDataPolygon],
                }
                document.querySelector('#editing-polyline-geocerca').classList.add('d-none');
                this.alert.fire('¡Cambios actualizados localmente!', '', 'success');


                //popupPlace.remove()
            });
        });

        //this.mapFleet.map.on('dblclick', "lyr-place-polygons", (e) => {
        //    document.querySelector('#editing-polyline-geocerca').classList.remove('d-none');
        //    document.querySelector('#namePolygonGeocerca').value = e.features[0].properties.descriptionPlace;
        //    document.querySelector('#namePolygonGeocerca').dataset.id = e.features[0].properties.placeShiftId;
        //    this.mapFleet.setData = {
        //        entityType: 'place',
        //        nameLayer: 'place-polygons',
        //        data: [this.db.setDataPolygon.filter(f => f.placeShiftId != e.features[0].properties.placeShiftId)],
        //    }
        //    this.drawPolygon.add(e.features[0]);
        //});

        // Change the cursor to a pointer when
        // the mouse is over the states layer.
        const popupPlaceShift = new mapboxgl.Popup();
        this.mapFleet.map.on('mouseenter', "lyr-place-polygons", (e) => {
            this.mapFleet.map.getCanvas().style.cursor = 'pointer';
            //const coordinates = e.features[0].geometry.coordinates.slice();
            //while (Math.abs(e.lngLat.lng - coordinates[0][0]) > 180) {
            //    coordinates[0] += e.lngLat.lng > coordinates[0][0] ? 360 : -360;
            //} 
            const properties = e.features[0].properties;
            const html = `<div class="cardDescriptionPlace p-0 m-0"  style="max-width:300px !important;">
                            <div class="h-100 text-end alert alert-primary alert-dismissible pe-2 alert-label-icon label-arrow fade show m-0" role="alert m-0">
                              <i class=" ri-radio-button-line label-icon"></i><strong>${properties.descriptionPlace}</strong> - ${this.db.placeShift.find(k => k.typePlaceId == properties.typePlaceId).descrition}
                              <br>
                              <small> <b>(Click Derecho para editar)</b></small>
                            </div>
                          </div>`;
            popupPlaceShift.setLngLat(e.lngLat).setHTML(html).addTo(this.mapFleet.map);
        });

        // Change the cursor back to a pointer
        // when it leaves the states layer.
        this.mapFleet.map.on('mouseleave', "lyr-place-polygons", () => {
            this.mapFleet.map.getCanvas().style.cursor = '';
            popupPlaceShift.remove();
        });
        //configuration HEATMAP
        this.mapFleet.map.on('mouseenter', 'lyr_velocidades', e => {

            const props = e.features[0].properties;
            this.popup
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(`
                        <div class="bg-success">Equipo: <strong>${props.codigo}</strong></div> 
                        `)
                .addTo(this.mapFleet.map);
        });

    }

    async showDatailsTour(data) {

        function smoothPath(points, tension) {
            const smoothedPoints = [];

            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i];
                const p1 = points[i + 1];
                //{date: '2023/10/07', time: '10:05:41', dateTimePositionApp: Sat Oct 07 2023 10:05:41 GMT-0500 (hora estándar de Perú), lat: -15.20557581, lng: -75.12740085}, 
                for (let t = 0; t <= 1; t += 0.1) {
                    const x = (1 - t) * p0.lng + t * p1.lng;
                    const y = (1 - t) * p0.lat + t * p1.lat;

                    smoothedPoints.push({ lat: y, lng: x, date: p0.date, time: p0.time, dateTimePositionApp: p0.dateTimePositionApp });
                }
            }

            return smoothedPoints;
        }

        await this.getTourtData(data.reportId)


        this.divTourEquipment.classList.remove('d-none');
        document.getElementById('profile-details-equipment').src = data.heavyImage;
        document.getElementById('informationTourEuipment').innerText = data.type + ': ' + data.code;
        //this.divTourEquipment.querySelector('.details-tour').innerText = '';
    }
    cleanTour() {
        this.init = 0;
        this.tourActive = false;
        this.divTourEquipment.classList.add('d-none');
        if (this.mapFleet && this.mapFleet.map.getLayer('tour')) {
            this.mapFleet.map.removeLayer('tour');
            this.mapFleet.map.removeSource('tour');
            this.marker.remove();
        }
    }
    generateDetailTour() {
        this.divTourEquipment.querySelector('button[data-action="close"]').addEventListener('click', e => {
            this.cleanTour();
        });

        this.divTourEquipment.querySelector('button[data-action="restart"]').addEventListener('click', e => {
            this.divTourEquipment.querySelector('button[data-action="close"]').disabled = true;
            this.divTourEquipment.querySelector('button[data-action="play"]').classList.add('d-none');
            this.divTourEquipment.querySelector('button[data-action="pause"]').classList.remove('d-none');
            this.tourActive = false;

            if (this.db.positionTourEquipment.length == 0) return;

            this.init = 0;
            this.touring = true;

            const dateTimeInit = new Date(this.divTourEquipment.querySelector('#hourInitTourEuipment').value);
            const dateTimeEnd = new Date(this.divTourEquipment.querySelector('#hourEndTourEuipment').value);

            const position = this.db.positionTourEquipment.filter(x => {
                //const datePos = formatDate(x.date, x.time);
                if (x.dateTimePositionApp >= dateTimeInit && x.dateTimePositionApp <= dateTimeEnd) {
                    return true;
                }
                else {
                    return false;
                }
            });

            this.cleanTour();
            this.showContentTouring(this.db.equipmentTouring, position, this.dateTouring, this.idTurnTour, false);

            requestAnimationFrame((timestamp) => this.animateMarker(timestamp));

        });

        this.divTourEquipment.querySelector('button[data-action="play"]').addEventListener('click', e => {

            if (!this.tourActive && this.init <= 1) {
                this.init = 0;
                const dateTimeInit = new Date(this.divTourEquipment.querySelector('#hourInitTourEuipment').value);
                const dateTimeEnd = new Date(this.divTourEquipment.querySelector('#hourEndTourEuipment').value);

                if (this.db.positionTourEquipment.length == 0) return;
                const position = this.db.positionTourEquipment.filter(x => {
                    //const datePos = formatDate(x.date, x.time);
                    if (x.dateTimePositionApp >= dateTimeInit && x.dateTimePositionApp <= dateTimeEnd) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });


                this.tour = position.map(x => [x.lng, x.lat]);
                this.dateTimeTour = position.map(x => `${x.date} ${x.time}`);
                this.cleanTour();
                this.showContentTouring(this.db.equipmentTouring, position, this.dateTouring, this.idTurnTour, false);
                this.endTour = this.tour.length;
            } else {
                this.tourActive = false;
            }


            this.divTourEquipment.querySelector('button[data-action="close"]').disabled = true;
            this.divTourEquipment.querySelector('button[data-action="play"]').classList.add('d-none');
            this.divTourEquipment.querySelector('button[data-action="pause"]').classList.remove('d-none');
            this.touring = true;

            requestAnimationFrame((timestamp) => this.animateMarker(timestamp));
        });
        this.divTourEquipment.querySelector('button[data-action="pause"]').addEventListener('click', e => {
            this.divTourEquipment.querySelector('button[data-action="close"]').disabled = false;
            this.divTourEquipment.querySelector('button[data-action="play"]').classList.remove('d-none');
            this.divTourEquipment.querySelector('button[data-action="pause"]').classList.add('d-none');
            this.touring = false;
            this.touringInMoving = true;
            requestAnimationFrame((timestamp) => this.animateMarker(timestamp));
        });
        //div.querySelector('button[data-action="descargar"]').addEventListener('click', e => {
        //    this.excelPosicionesEquipo.descargar();
        //});
    }
    showContentTouring(equipment, position, date, idTurn, init) {
        if (init) {
            this.positionTouring = position;
            this.equipmentTouring = equipment;
            this.dateTouring = date;
            this.idTurnTour = idTurn;
        }


        this.tourActive = true;
        this.tour = position.map(x => [x.lng, x.lat]);
        this.dateTimeTour = position.map(x => `${x.date} ${x.time}`);
        this.endTour = this.tour.length;

        try {
            if (this.mapFleet.map.getSource('tour')) {
                this.cleanTour();
                this.divTourEquipment.querySelector('button[data-action="close"]').disabled = false;
                this.divTourEquipment.querySelector('button[data-action="play"]').classList.remove('d-none');
                this.divTourEquipment.querySelector('button[data-action="pause"]').classList.add('d-none');
                this.touring = false;
                requestAnimationFrame((timestamp) => this.animateMarker(timestamp));
            }
        } catch (e) {
            console.error(e)
        }


        this.mapFleet.map.addSource('tour', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'properties': {},
                'geometry': {
                    'type': 'LineString',
                    'coordinates': this.tour
                },
            }
        });
        this.mapFleet.map.addLayer({
            'id': 'tour',
            'type': 'line',
            'source': 'tour',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#ff000d',
                'line-width': 3
            }
        });

        this.divTourEquipment.classList.remove('d-none');

        this.marker.setLngLat(this.tour[this.init]);
        this.marker.addTo(this.mapFleet.map);
    }
    animateMarker(timestamp) {
        if (this.tour.length <= 0) return
        this.marker.setLngLat(
            this.tour[this.init]
        );
        this.divTourEquipment.querySelector('td.date-time-touring').innerText = this.dateTimeTour[this.init];
        this.init++;
        this.marker.addTo(this.mapFleet.map);
        if (this.init < this.endTour && this.touring) {
            requestAnimationFrame((timestamp) => {
                setTimeout(() => {
                    console.log("Retrasado por 0.01 segundo.");
                    this.animateMarker(timestamp)
                }, "70");
            });
        }
        if (this.init >= this.endTour) {
            this.touring = false;
            this.init = 0;
            this.divTourEquipment.querySelector('button[data-action="close"]').disabled = false;
            this.divTourEquipment.querySelector('button[data-action="play"]').classList.remove('d-none');
            this.divTourEquipment.querySelector('button[data-action="pause"]').classList.add('d-none');
        }
    }
    htmlDetailTour(posInit, posEnd) {
        //let dataDateI = (posInit.date).split('/');
        //let dataDateE = (posEnd.date).split('/');
        return `<div class="mt-5 bg-soft-primary rounded rounded-3" style="padding: 5px; border: 4px solid #405188b8;">
                    <div class="h6">Fecha Filtro</div>
                    <table class="mb-0 table table-borderless table-light table-sm ">
                        <tr>
                            <td class="text-end">Inicio</td>
                            <td><input type="datetime-local" disabled class="in-edicion-fecha" data-id="fecha-ini" style="padding-left:10px; width: 200px;" value="${posInit.dateTimePositionApp.toDateHTML()}T${posInit.time}"></td>
                        </tr>
                        <tr>
                            <td class="text-end">Fin</td>
                            <td><input type="datetime-local" disabled class="in-edicion-fecha" data-id="fecha-fin" style="padding-left:10px; width: 200px;" value="${posEnd.dateTimePositionApp.toDateHTML()}T${posEnd.time}"></td>
                        </tr>
                        <tr>
                            <td class="text-end">Recorriendo</td>
                            <td class="date-time-touring"></td>
                        </tr>
                    </table>
                </div>`;
    }

    located(coord, zoom = 15) {
        this.mapFleet.locationMap(coord, zoom);
    }
    resize() {
        this.mapFleet.map.resize();
    }

    layers() {
        this.mapFleet.createLayer({
            data: [],
            entityType: 'place',
            nameLayer: 'place-polygons',
            colorExpr: 'areaColor',
            textExpr: 'descriptionPlace'
        });

        this.mapFleet.createLayer({
            data: [],
            entityType: 'vehicle',
            nameLayer: 'fleet',
            imageExpr: 'vehicleType',
            rotationExpr: 'vehicleRotation',
            textExprRealTime: 'speedHour',
            textExpr: 'code'
        });

    }
    set setRoutes(v) {
        //console.log('routes', v);
        this.mapFleet.setRoutes = v
    }
    set setHeatMap(v) {
        //console.log('routes', v);
        this.mapFleet.setHeatMap = v
    }
    set setDataVehicle(v) {
        this.mapFleet.setData = {
            entityType: 'vehicle',
            nameLayer: 'fleet',
            data: v,
            imageExpr: 'vehicleType',
            textExpr: 'code',
            rotationExpr: 'vehicleRotation',
            textExprRealTime: 'speedHour',
        };
    }

    set setDataPlace(v) { //mcardenas
        this.db.setDataPolygon = v;
        this.mapFleet.setData = {
            entityType: 'place',
            nameLayer: 'place-polygons',
            data: [v],
            colorExpr: 'areaColor',
            textExpr: 'descriptionPlace',
        }
    }

    set setCircles(v) {
        this.mapFleet.setData = {
            entityType: 'radius',
            nameLayer: 'place-radius',
            data: v,
        }
    }


    set setTest(v) {
        //alert('x');
    }

    routes() {
        return this.mapFleet.routes();
    }

    element() {
        return this._wrapper;
    }
    //#region getTourtData 
    async getInitDataMap() {
        try {
            const data = await FLEETS_MAP.getInitDataMap();
            this.db.placeShift = data.placeShift;
            this.db.material = data.material;
            //console.log(this.db.placeShift);
            //console.log('iPlaceId', this.db.material);
        } catch (e) {
            throw e;
        }
    }
    //#endregion
    //#region getTourtData 
    async getTourtData(reportId) {
        try {
            const data = await FLEETS_MAP.getTourtData(reportId);
            this.db.positionTourEquipment = data.historygps;
        } catch (e) {
            throw e;
        }
    }
    //#endregion
    //#region getTourtData 
    async updatePolygonData(dateFleetManagement, idshift, tramaPlaceShift, tramaPlacePolygonShift) {
        try {
            this.alert.fire({
                title: `Se modificará todos los cambios en las geocercas del turno seleccionado ¿Desea actualizar todos los cambios?`,
                text: `Se realizarán cambios en la(s) geocerca(s) y afectará en los viajes.`,
                icon: 'question',
                showCancelButton: true,
                reverseButtons: true,
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const data = await FLEETS_MAP.updatePolygonFleetManagement(dateFleetManagement, idshift, tramaPlaceShift, tramaPlacePolygonShift);
                    if (data) {
                        console.log(data.placeShiftGeocerca);
                        this.setDataPlace = data.placeShiftGeocerca;
                        this.alert.fire('¡Cambios actualizados correctamente!', '', 'success');
                    } else {
                        this.alert.fire('¡Ups Comuniquesé con su administrador!', '', 'error');
                    }
                } else {
                    this.alert.fire('¡No se realizó los cambios!', '', 'warning');
                }
            })

        } catch (e) {
            throw e;
            this.alert.fire('¡Ups Comuniquesé con su administrador!', '', 'error');
        }
    }
    //#endregion
}

export default Map;