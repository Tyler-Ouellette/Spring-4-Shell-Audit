"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter = require('../utils/jsonToCSV');
const dynatrace_api_client_1 = require("@dt-esa/dynatrace-api-client");
// const DynatraceTenantAPI = require('@dt-esa/dynatrace-api-client');
exports.spring4ShellProd = async (req, res) => {
    const api = new dynatrace_api_client_1.DynatraceTenantAPI({
        token: process.env["TOKEN"],
        url: process.env["URL"] + "/"
    }, false);
    // const cveID = 'CVE-2022-22965';
    const securityProblemID = '1340823583484240022';
    const securityProblems = await api.v2.securityProblems.getSecurityProblem(securityProblemID, {
        fields: encodeURIComponent("+riskAssessment,+vulnerableComponents,+managementZones,+affectedEntities,+exposedEntities,+reachableDataAssets")
    });
    // return res.send(securityProblems);
    const affectedEntities = securityProblems.affectedEntities;
    const { entities } = await api.v2.entities.getEntities({
        entitySelector: "TYPE(PROCESS_GROUP_INSTANCE),softwareTechnologies(\"JAVA\",\"APACHE_TOMCAT\")",
        // fields: "+properties.softwareTechnologies,+managementZones,+tags,+fromRelationships.isProcessOf",
        fields: "+properties.softwareTechnologies,+managementZones,+fromRelationships.isProcessOf",
        pageSize: 4000
    });
    const afftectedProcessDetails = entities.filter(e => affectedEntities.includes(e.entityId));
    const filteredPositives = afftectedProcessDetails
        .filter(process => process.properties.softwareTechnologies
        .filter(st => st.type == 'JAVA') // filter technologies to java
        .filter(st => /^9\.\d+\.\d+/.test(st.version) ||
        /^10\.\d+\.\d+/.test(st.version) ||
        /^11\.\d+\.\d+/.test(st.version) ||
        /^12\.\d+\.\d+/.test(st.version) ||
        /^13\.\d+\.\d+/.test(st.version) ||
        /^14\.\d+\.\d+/.test(st.version) ||
        /^15\.\d+\.\d+/.test(st.version) ||
        /^16\.\d+\.\d+/.test(st.version) ||
        /^17\.\d+\.\d+/.test(st.version) ||
        /^18\.\d+\.\d+/.test(st.version)) // Filter to all that are a potentially vulnerable version
        .length > 0);
    const linkAdded = filteredPositives.map(pgi => {
        let added = pgi;
        added["Link"] = `${process.env.URL}/#processdetails;id=${pgi.entityId};gf=all;gtf=-2h`;
        return added;
    });
    const namedHosts = await Promise.all(linkAdded.map(async (process) => {
        const host = await api.v2.entities.getEntity(process.fromRelationships.isProcessOf[0].id);
        let named = process;
        named["hostName"] = host.displayName;
        named["IP"] = host.properties.ipAddress.toString();
        const mzs = host.managementZones.map(mz => mz.name);
        named["Barcodes"] = mzs.toString();
        delete named.managementZones;
        return named;
    }));
    // const fixedTags = namedHosts.map(process => {
    //     const tags = process.tags.map(tag => tag.stringRepresentation);
    //     let fixed = process;
    //     fixed["tags"] = tags.toString() as any;
    //     return fixed;
    // })
    const removedRelationships = namedHosts.map(process => {
        delete process.fromRelationships;
        return process;
    });
    const softwareTechnologiesFlattened = removedRelationships.map(process => {
        const tech = process.properties.softwareTechnologies;
        let fixed = process;
        let jTech = tech.filter(t => t.type == "JAVA" && t.version);
        let aTech = tech.filter(t => t.type == "APACHE_TOMCAT" && t.version);
        fixed["JAVA_Edition"] = jTech.map(t => t.edition || "n/a").join(", ");
        fixed["JAVA_Version"] = jTech.map(t => t.version || "n/a").join(", ");
        fixed["TOMCAT_Version"] = aTech.map(t => t.version || "n/a").join(", ");
        delete fixed.properties;
        return fixed;
    });
    const converted = converter.JSONToCSVConvertor(softwareTechnologiesFlattened, "Spring4ShellPositives", true);
    // return res.send(converted);
    return res.send(converted);
};
