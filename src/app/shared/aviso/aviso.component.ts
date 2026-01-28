import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-aviso',
    templateUrl: './aviso.component.html',
    styleUrls: ['./aviso.component.css']
})
export class AvisoComponent {
    @Input() diverprofile:any;
    @Input() aviso:any;
    constructor () {}
}