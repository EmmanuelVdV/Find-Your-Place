class Shape {
    constructor(_id, upCol, upRow, isSingularity) {
        this.id = _id;
        this.upperCellCol = upCol;
        this.upperCellRow = upRow;
        grid[upCol][upRow] = this.id; // mark grid cell as "taken"

        this.isSingularity = isSingularity; // is the singularity ?

        this.shWidth = this.shHeight = 1;
        this.canGrow = true;

        this.size = random(8, 12); // final size between 60% and 95%
        // this.size = 9.9;
        this.hatchDirection = Math.round(random(1)); // 0: horizontal, 1: vertical

        let e = Math.floor(easings.length * fxrand());
        this.easing = easings[e];
        // console.log(e, easings[e](45));
    }

    render() {
        let w = this.shWidth * cellSize * this.size / 10; // drawing size (x% of actual size)
        let h = this.shHeight * cellSize * this.size / 10;

        let cw = (this.upperCellCol + this.shWidth / 2) * cellSize; // center of shape
        let ch = (this.upperCellRow + this.shHeight / 2) * cellSize;

        if (this.isSingularity) { stroke('#8B0000'); } else { stroke(255); }

        if (drawBorders) {
            rect(cw, ch, w, h);
        }

        if (this.hatchDirection == 0) {
            let hatch = round(map(h, cellSize, 10 * cellSize, 1, maxHatch));
            for (let i = 1; i <= hatch; i++) {
                let j = map(i, 1, hatch, 0, 1);
                line(cw - w / 2, ch - h / 2 + i * h / hatch * this.easing(j), cw + w / 2, ch - h / 2 + i * h / hatch * this.easing(j));
            }
        } else {
            let hatch = round(map(w, cellSize, 10 * cellSize, 1, maxHatch));
            for (let i = 1; i <= hatch; i++) {
                let j = map(i, 1, hatch, 0, 1);
                line(cw - w / 2 + i * w / hatch * this.easing(j), ch - h / 2, cw - w / 2 + i * w / hatch * this.easing(j), ch + h / 2);
            }
        }
    }

    renderSVG(d, g) {
        let w = this.shWidth * cellSize * this.size / 10; // drawing size (x% of actual size)
        let h = this.shHeight * cellSize * this.size / 10;

        let cw = (this.upperCellCol + this.shWidth / 2) * cellSize; // center of shape
        let ch = (this.upperCellRow + this.shHeight / 2) * cellSize;

        if (this.hatchDirection == 0) {
            let hatch = round(map(h, cellSize, 10 * cellSize, 1, maxHatch));
            for (let i = 1; i <= hatch; i++) {
                let j = map(i, 1, hatch, 0, 1);
                let line = d.line(cw - w / 2, ch - h / 2 + i * h / hatch * this.easing(j), cw + w / 2, ch - h / 2 + i * h / hatch * this.easing(j));
                if (this.isSingularity) {
                    line.stroke({ color: '#8B0000' });
                    g[0].add(line);
                } else {
                    line.stroke({ color: '#FFFFFF' });
                    g[1].add(line);
                }
            }
        } else {
            let hatch = round(map(w, cellSize, 10 * cellSize, 1, maxHatch));
            for (let i = 1; i <= hatch; i++) {
                let j = map(i, 1, hatch, 0, 1);
                let line = d.line(cw - w / 2 + i * w / hatch * this.easing(j), ch - h / 2, cw - w / 2 + i * w / hatch * this.easing(j), ch + h / 2);
                if (this.isSingularity) {
                    line.stroke({ color: '#8B0000' });
                    g[0].add(line);
                } else {
                    line.stroke({ color: '#FFFFFF' });
                    g[1].add(line);
                }
            }
        }
    }

grow(dir) {
    // direction : 0 = West, 1 = North, 2 = East, 3 = South
    let isOK = true;

    // console.log(dir+" "+this.upperCellCol+" "+this.shWidth+" "+this.upperCellRow+" "+this.shHeight);

    switch (dir) {

        case 0:
            if (this.upperCellCol == 0) return false; // test border
            for (let i = 0; i < this.shHeight; i++) {
                if (grid[this.upperCellCol - 1][this.upperCellRow + i] != 0) isOK = false; // check if cells are free in "direction"
            }

            if (isOK) {
                for (let i = 0; i < this.shHeight; i++) {
                    grid[this.upperCellCol - 1][this.upperCellRow + i] = this.id; // occupy the cells
                }
                this.upperCellCol -= 1;
                this.shWidth += 1;

                return true;
            }
            return false;

        case 1:
            if (this.upperCellRow == 0) return false; // test border
            for (let i = 0; i < this.shWidth; i++) {
                if (grid[this.upperCellCol + i][this.upperCellRow - 1] != 0) isOK = false; // check if cells are free in "direction"
            }

            if (isOK) {
                for (let i = 0; i < this.shWidth; i++) {
                    grid[this.upperCellCol + i][this.upperCellRow - 1] = this.id; // occupy the cells
                }
                this.upperCellRow -= 1;
                this.shHeight += 1;
                return true;
            }
            return false;

        case 2:
            if ((this.upperCellCol + this.shWidth) >= gridCols) return false; // test border
            for (let i = 0; i < this.shHeight; i++) {
                if (grid[this.upperCellCol + this.shWidth][this.upperCellRow + i] != 0) isOK = false; // check if cells are free in "direction"
            }

            if (isOK) {
                for (let i = 0; i < this.shHeight; i++) {
                    grid[this.upperCellCol + this.shWidth][this.upperCellRow + i] = this.id; // occupy the cells
                }
                this.shWidth += 1;
                return true;
            }
            return false;

        case 3:
            if ((this.upperCellRow + this.shHeight) >= gridRows) return false; // test boder
            for (let i = 0; i < this.shWidth; i++) {
                if (grid[this.upperCellCol + i][this.upperCellRow + this.shHeight] != 0) isOK = false; // check if cells are free in "direction"
            }

            if (isOK) {
                for (let i = 0; i < this.shWidth; i++) {
                    grid[this.upperCellCol + i][this.upperCellRow + this.shHeight] = this.id; // occupy the cells
                }
                this.shHeight += 1;
                return true;
            }
            return false;

        default: // something went wrong
            println("something went wrong");
            return false;
    }
}
}