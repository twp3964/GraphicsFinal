function radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function addTriangle (x0,y0,z0,x1,y1,z1,x2,y2,z2) {

    
    var nverts = points.length / 4;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}

function makeGrid(subdivisions){
    let side_dist = 2/subdivisions;
    let x = 1;
    let y = 0;
    let z = 1;

    for (let Sz = 0;Sz < subdivisions; Sz++) { //step z
        for (let Sx = 0; Sx < subdivisions; Sx++) { //step x
            addTriangle(
                x,y,z,
                x-side_dist,y,z,
                x,y,z-side_dist
            );

            addTriangle(
                x-side_dist,y,z-side_dist,    
                x,y,z-side_dist,            
                x-side_dist,y,z
            );
            z -= side_dist;
        }
        z = 1;
        x -= side_dist;
    }
}



function makeCube (subdivisions)  {
    // fill in your code here.
    // delete the code below first.
    let legDist = 1/subdivisions;

    // // face 1
    // let x = 0.5;
    // let y = 0.5;
    // let z = 0.5;

    // for (let Sy = 0; Sy < subdivisions; Sy++){ // step y
    //     for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
    //         addTriangle(
    //             x,y,z,
    //             x,y-legDist,z,
    //             x-legDist,y,z
                
    //             );
    //         addTriangle(
    //             x-legDist,y-legDist,z,
    //             x-legDist,y,z,              
    //             x,y-legDist,z
                
    //             );
    //         y -= legDist;
    //     }
    //     y = 0.5;
    //     x -= legDist;
    // }

    // //face 2
    // x = 0.5;
    // y = 0.5;
    // z = -0.5;

    // for (let Sy = 0; Sy < subdivisions; Sy++){ //step y
    //     for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
    //         addTriangle(
    //             x,y,z,
    //             x,y,z+legDist,
    //             x,y-legDist,z
    //             );
    //         addTriangle(
    //             x,y,z+legDist,                
    //             x,y-legDist,z+legDist,
    //             x,y-legDist,z
    //             );
    //         y -= legDist;
    //     }
    //     y = 0.5;
    //     z += legDist;
    // }

    // //face 3
    // x = -0.5;
    // y = 0.5;
    // z = -0.5;

    // for (let Sy = 0; Sy < subdivisions; Sy++){ //step y
    //     for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
    //         addTriangle(
    //             x,y,z,
    //             x+legDist,y,z,
    //             x,y-legDist,z
    //             );
    //         addTriangle(
    //             x+legDist,y-legDist,z,                
    //             x,y-legDist,z,
    //             x+legDist,y,z
    //             );
    //         y -= legDist;
    //     }
    //     y = 0.5;
    //     x += legDist;
    // }

    // //face 4
    // x = -0.5;
    // y = 0.5;
    // z = 0.5;

    // for (let Sy = 0; Sy < subdivisions; Sy++){ //step y
    //     for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
    //         addTriangle(
    //             x,y,z,
    //             x,y,z-legDist,
    //             x,y-legDist,z
    //             );
    //         addTriangle(
    //             x,y-legDist,z-legDist,                
    //             x,y-legDist,z,
    //             x,y,z-legDist
    //             );
    //         y -= legDist;
    //     }
    //     y = 0.5;
    //     z -= legDist;
    // }

    // //face 5
    // x = 0.5;
    // y = 0.5;
    // z = 0.5;

    // for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
    //     for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
    //         addTriangle(
    //             x,y,z,
    //             x-legDist,y,z,
    //             x,y,z-legDist
    //             );
    //         addTriangle(
    //             x-legDist,y,z-legDist,                
    //             x,y,z-legDist,
    //             x-legDist,y,z
    //             );
    //         z -= legDist;
    //     }
    //     z = 0.5;
    //     x -= legDist;
    // }

    //     //face 5.5
    //     x = 0.5;
    //     y = 0;
    //     z = 0.5;
    
    //     for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
    //         for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
    //             addTriangle(
    //                 x,y,z,
    //                 x-legDist,y,z,
    //                 x,y,z-legDist
    //                 );
    //             addTriangle(
    //                 x-legDist,y,z-legDist,  
    //                 x,y,z-legDist,              
    //                 x-legDist,y,z
    //                 );
    //             z -= legDist;
    //         }
    //         z = 0.5;
    //         x -= legDist;
    //     }


    //face floor 1
    x = 0.5;
    y = 0;
    z = 0.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist,  
                x-legDist,y,z,  
                x,y,z-legDist           
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }

    //face floor 2
    x = 1.5;
    y = 0;
    z = 0.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist,  
                x-legDist,y,z, 
                x,y,z-legDist         
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }

    //face floor 3
    x = -0.5;
    y = 0;
    z = 0.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist, 
                x-legDist,y,z,  
                x,y,z-legDist
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }


    //face floor 4
    x = 0.5;
    y = 0;
    z = 1.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist,  
                x-legDist,y,z,
                x,y,z-legDist
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }


    //face floor 4
    x = 0.5;
    y = 0;
    z = -0.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist, 
                x-legDist,y,z,      
                x,y,z-legDist   
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }

    //face floor 4
    x = 0.5;
    y = 0;
    z = -1.5;

    for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
        for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
            addTriangle(
                x,y,z,
                x,y,z-legDist,
                x-legDist,y,z
                );
            addTriangle(
                x-legDist,y,z-legDist, 
                x-legDist,y,z,      
                x,y,z-legDist   
                );
            z -= legDist;
        }
        z = 0.5;
        x -= legDist;
    }

    // //face 6
    // x = 0.5;
    // y = -0.5;
    // z = 0.5;

    // for (let Sz = 0; Sz < subdivisions; Sz++){ //step z
    //     for (let Sx = 0; Sx < subdivisions; Sx++){ //step x
    //         addTriangle(
    //             x,y,z,  
    //             x,y,z-legDist,              
    //             x-legDist,y,z
    //             );
    //         addTriangle(
    //             x-legDist,y,z-legDist,  
    //             x-legDist,y,z,              
    //             x,y,z-legDist
    //             );
    //         z -= legDist;
    //     }
    //     z = 0.5;
    //     x -= legDist;
    // }
}

function addVert(x0,y0,z0){
    var nverts = points.length / 4;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}


function addQuad(x0,y0,z0,x1,y1,z1,x2,y2,z2,x3,y3,z3) {

    
    var nverts = points.length / 4;
    
    // push first vertex
    points.push(x0);  bary.push (1.0);
    points.push(y0);  bary.push (0.0);
    points.push(z0);  bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
    
    // push second vertex
    points.push(x1); bary.push (0.0);
    points.push(y1); bary.push (1.0);
    points.push(z1); bary.push (0.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++
    
    // push third vertex
    points.push(x2); bary.push (0.0);
    points.push(y2); bary.push (0.0);
    points.push(z2); bary.push (1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;

    // push third vertex
    points.push(x3); bary.push (0.0);
    points.push(y3); bary.push (0.0);
    points.push(z3); bary.push (1.0);
    points.push(1.0);
    indices.push(nverts);
    nverts++;
}