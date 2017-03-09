import React, {Component} from 'react';
import moment from 'moment';

function isEmptyField(value) {
    if (Array.isArray(value)) {
        value = value[0];
    }

    if (value === null || (typeof value === 'undefined')) {
        return true;
    }

    const v = value.trim();
    return v === '' || v === '-' || v === 'None';
}

function reformatDate(date) { //handles single dates or an array of dates
    if (isEmptyField(date)) {
        return date;
    }
    if (!Array.isArray(date)) {
        date = date.split(',');
    }
    return date.map(function(d) {
        return moment.utc(new Date(d)).format("DD MMMM YYYY");
    }).join();
}

class VersionsDisplay extends Component {
    pathogenicityChanged(pathogenicityDiff) {
        return !!(pathogenicityDiff.added || pathogenicityDiff.removed);
    }

    generateDiffRows(cols, data) {
        const diffRows = [];

        // keys that contain date values that need reformatting for the ui
        const dateKeys = [
            "Date_Last_Updated_ClinVar",
            "Date_last_evaluated_ENIGMA"
        ];

        // In research_mode, only show research_mode changes.
        const relevantFieldsToDisplayChanges = cols.map(function(col) {
            return col.prop;
        });

        for (let i = 0; i < data.length; i++) {
            let version = data[i];
            let diff = version.Diff;
            let release = version.Data_Release;
            let highlightRow = false;
            const diffHTML = [];

            if (diff !== null) {
                for (let j = 0; j < diff.length; j++) {
                    let fieldDiff = diff[j];
                    let fieldName = fieldDiff.field;
                    let added;
                    let removed;

                    if (fieldName === "Pathogenicity_expert") {
                        highlightRow = this.pathogenicityChanged(fieldDiff);
                    }

                    if (!_.contains(relevantFieldsToDisplayChanges, fieldName)) {
                        continue;
                    }

                    if (_.contains(dateKeys, fieldName)) {
                        added = this.reformatDate(fieldDiff.added);
                        removed = this.reformatDate(fieldDiff.removed);
                    } else if (fieldDiff.field_type === "list") {
                        added = _.map(fieldDiff.added, elem => elem.replace(/_/g, " ").trim());
                        removed = _.map(fieldDiff.removed, elem => elem.replace(/_/g, " ").trim());
                    } else {
                        added = fieldDiff.added.trim();
                        removed = fieldDiff.removed.trim();
                    }

                    if (added !== null || removed !== null) {
                        if (isEmptyField(removed)) {
                            diffHTML.push(
                                <View>
                                    <Text>{ getDisplayName(fieldName) }: </Text>
                                    <span className='label label-success'><span className='glyphicon glyphicon-star'></span> New</span>
                                    &nbsp;{added}
                                </View>, <br />
                            );
                        } else if (fieldDiff.field_type === "list") {
                            diffHTML.push(
                                <View>
                                    <Text>{ getDisplayName(fieldName) }: </Text> <br />
                                    { !isEmptyDiff(added) && `+${added}` }{ !!(!isEmptyDiff(added) && !isEmptyDiff(removed)) && ', '}{ !isEmptyDiff(removed) && `-${removed}` }
                                </View>, <br />
                            );
                        } else if (fieldDiff.field_type === "individual") {
                            diffHTML.push(
                                <span>
                                    <strong>{ getDisplayName(fieldName) }: </strong>
                                    {removed} <span className="glyphicon glyphicon-arrow-right"></span> {added}
                                </span>, <br />
                            );
                        }
                    }
                }
            }

            diffRows.push(
                <tr className={highlightRow ? 'danger' : ''}>
                    <td><Link to={`/release/${release.id}`}>{moment(release.date, "YYYY-MM-DDTHH:mm:ss").format("DD MMMM YYYY")}</Link></td>
                    <td>{version["Pathogenicity_expert"]}</td>
                    <td>{diffHTML}</td>
                </tr>
            );
        }

        return diffRows;
    }

    render() {
        let cols, data;
        return this.generateDiffRows(cols, data);
    }
}