import * as Assets from './assets';
import { Physics, scaleModes } from 'phaser-ce';

export class GravityPhysics {
    public metersPerPixel: number;
    public tickRate: number;

    private bodies: GravityBody[];

    constructor(metersPerPixel: number, tickRate: number) {
        this.metersPerPixel = metersPerPixel;
        this.bodies = [];
        this.tickRate = tickRate;
    }

    public addBody(body: GravityBody) {
        this.bodies.push(body);
    }

    public updateBodyPositions() {
        this.bodies.map((curr) => {
            let forceX = 0;
            let forceY = 0;
            this.bodies.map((target) => {
                if (target == curr) {
                    return;
                }
                let rawForce = (curr.mass * target.mass) / this.distanceBetween(curr.loc, target.loc);
                let angle = this.getAngleTo(curr.loc, target.loc);
                let dforceX = rawForce * Math.cos(angle);
                let dforceY = rawForce * Math.sin(angle);
                forceX += dforceX;
                forceY += dforceY;
            })
            let accelX = forceX / curr.mass;
            let accelY = forceY / curr.mass;

            curr.vx += accelX;
            curr.vy += accelY;
        })

        this.bodies.map((curr) => {
            curr.loc.x += curr.vx * this.tickRate;
            curr.loc.y += curr.vy * this.tickRate;

            curr.sprite.centerX = curr.loc.x / this.metersPerPixel;
            curr.sprite.centerY = -curr.loc.y / this.metersPerPixel;
        })
    }

    public distanceBetween(b1: Point, b2: Point): number {
        let dx = b1.x - b2.x;
        let dy = b1.y - b2.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    }

    public getAngleTo(source: Point, target: Point): number {
        return Math.atan2(target.y - source.y, target.x - source.x);
    }
};

export type Meters = number;
export type MetersPerSecond = number;
export type Kilogram = number;

export interface Point {
    x: Meters;
    y: Meters;
}

export interface GravityBody {
    loc: Point;
    sprite: Phaser.Sprite;
    mass: number;
    vx: MetersPerSecond;
    vy: MetersPerSecond;
}

export class BasicGravityBody implements GravityBody {
    public loc: Point;
    public sprite: Phaser.Sprite;
    public mass: Kilogram;
    public vx: MetersPerSecond;
    public vy: MetersPerSecond;

    constructor(sprite: Phaser.Sprite, metersPerPixel: number, mass: Kilogram) {
        let x = sprite.centerX * metersPerPixel;
        let y = sprite.centerY * metersPerPixel * -1.0;
        this.loc = {
            x: x,
            y: y
        };
        this.sprite = sprite;
        this.mass = mass;
        this.vx = 0;
        this.vy = 0;
    }
}