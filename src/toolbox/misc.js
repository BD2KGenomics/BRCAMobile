/**
 * Created by Faisal on 11/17/16.
 */

// utility method to combine [[1,2,3],[4,5,6]] into [[1,4],[2,5],[3,6]]
function zip(rows) {
    return rows[0].map((_,c)=>rows.map(row=>row[c]));
}