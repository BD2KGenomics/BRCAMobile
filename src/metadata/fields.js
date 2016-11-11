// column titles copied from

export var columns = [
    {title: 'Gene', prop: 'Gene_Symbol'},
    {title: 'HGVS Nucleotide', prop: 'HGVS_cDNA', render: nucleotide => nucleotide.split(':')[1]},
    {title: 'Transcript Identifier', prop: 'Reference_Sequence'},
    {title: 'HGVS RNA', prop: 'HGVS_RNA'},
    {title: 'HGVS Protein', prop: 'HGVS_Protein', render: protein => protein.split(':')[1]},
    // Protein Identfifier is pulled from HGVS_Protein, this is handled in VariantDetail (index.js)
    {title: 'Protein Identifier', prop: 'HGVS_Protein_ID'},
    {title: 'Protein Abbrev', prop: 'Protein_Change'},
    {title: 'BIC Designation', prop: 'BIC_Nomenclature'},
    {title: 'Genomic Nomenclature (GRCh38)', prop: 'Genomic_Coordinate_hg38'},
    {title: 'Genomic Nomenclature (GRCh37)', prop: 'Genomic_Coordinate_hg37'},
    {title: 'Clinical Significance', prop: 'Pathogenicity_expert'},
    {title: 'IARC Class', prop: 'Clinical_significance_ENIGMA'},
    {title: 'Comment on Clinical Significance', prop: 'Comment_on_clinical_significance_ENIGMA'},
    {title: 'Clinical Significance Citations', prop: 'Clinical_significance_citations_ENIGMA'},
    {title: 'Supporting Evidence URL(s)', prop: 'URL_ENIGMA'},
    {title: 'Date Last Evaluated', prop: 'Date_last_evaluated_ENIGMA'},
    {title: 'Assertion Method', prop: 'Assertion_method_ENIGMA'},
    {title: 'Assertion Method Citation', prop: 'Assertion_method_citation_ENIGMA'},
    {title: 'Allele Origin', prop: 'Allele_origin_ENIGMA'},
    {title: 'ClinVar Accession', prop: 'ClinVarAccession_ENIGMA'}
];

export var researchModeColumns = [
    {title: 'Gene Symbol', prop: 'Gene_Symbol'},
    {title: 'Genome (GRCh36)', prop: 'Genomic_Coordinate_hg36'},
    {title: 'Genome (GRCh37)', prop: 'Genomic_Coordinate_hg37'},
    {title: 'Genome (GRCh38)', prop: 'Genomic_Coordinate_hg38'},

    {title: 'Mutation category (BIC)', prop: 'Mutation_type_BIC'},
    {title: 'PolyPhen score', prop: 'PolyPhen_Score'},
    {title: 'SIFT score', prop: 'Sift_Score'},


    {title: 'BIC Variant Identifier', prop: 'BIC_Nomenclature'},
    {title: 'Nucleotide', prop: 'HGVS_cDNA'},
    {title: 'Protein', prop: 'HGVS_Protein'},
    {title: 'SCV Accession (ClinVar)', prop: 'SCV_ClinVar'},
    {title: 'Source(s)', prop: 'Source'},
    {title: 'Source URL(s)', prop: 'Source_URL'},
    {title: 'Synonyms', prop: 'Synonyms'},
    {title: 'Protein Amino Acid Change', prop: 'Protein_Change'},
    {title: 'Reference cDNA Sequence', prop: 'Reference_Sequence'},

    {title: 'Allele Origin (ClinVar)', prop: 'Allele_Origin_ClinVar'},
    {title: 'Allele Origin (ENIGMA)', prop: 'Allele_origin_ENIGMA'},
    {title: 'Ethnicity (BIC)', prop: 'Ethnicity_BIC'},
    {title: 'Allele Origin (BIC)', prop: 'Germline_or_Somatic_BIC'},
    {title: 'Patient Nationality (BIC)', prop: 'Patient_nationality_BIC'},
    {title: 'Variant Haplotype (LOVD)', prop: 'Variant_haplotype_LOVD'},

    {title: 'Family members carrying this variant (BIC)', prop: 'Number_of_family_member_carrying_mutation_BIC'},

    {title: 'Co-occurrence likelihood (exLOVD)', prop: 'Co_occurrence_LR_exLOVD'},
    {title: 'Prior probability of pathogenicity (exLOVD)', prop: 'Combined_prior_probablility_exLOVD'},
    {
        title: 'Missense analysis probability of pathogenicity (exLOVD)',
        prop: 'Missense_analysis_prior_probability_exLOVD'
    },
    {title: 'Probability of pathogenicity (exLOVD)', prop: 'Posterior_probability_exLOVD'},
    {title: 'Segregation Likelihood Ratio (exLOVD)', prop: 'Segregation_LR_exLOVD'},
    {title: 'Summary Family History Likelihood Ratio (exLOVD)', prop: 'Sum_family_LR_exLOVD'},

    {title: 'Assertion Method (ENIGMA)', prop: 'Assertion_method_citation_ENIGMA'},
    {title: 'Clinical Significance Citation (ENIGMA)', prop: 'Clinical_significance_citations_ENIGMA'},
    {title: 'Literature Reference (BIC)', prop: 'Literature_citation_BIC'},
    {title: 'Literature Reference (exLOVD)', prop: 'Literature_source_exLOVD'},
    {title: 'Pathogenicity', prop: 'Pathogenicity_all'},

    {title: 'Assertion Method (ENIGMA)', prop: 'Assertion_method_ENIGMA'},
    {title: 'Clinical Significance (BIC)', prop: 'Clinical_classification_BIC'},
    {title: 'Clinical Importance (BIC)', prop: 'Clinical_importance_BIC'},
    {title: 'Clinical Significance (ClinVar)', prop: 'Clinical_Significance_ClinVar'},
    {title: 'Clinical Significance (ENIGMA)', prop: 'Clinical_significance_ENIGMA'},
    {title: 'Collection Method (ENIGMA)', prop: 'Collection_method_ENIGMA'},
    {title: 'Comment on Clinical Significance (ENIGMA)', prop: 'Comment_on_clinical_significance_ENIGMA'},
    {title: 'Date last evaluated (ENIGMA)', prop: 'Date_last_evaluated_ENIGMA'},
    {title: 'Date last updated (ClinVar)', prop: 'Date_Last_Updated_ClinVar'},
    {title: 'Has Discordant Evidence', prop: 'Discordant'},
    {title: 'Functional Analysis Result (LOVD)', prop: 'Functional_analysis_result_LOVD'},
    {title: 'Functional Analysis Method (LOVD)', prop: 'Functional_analysis_technique_LOVD'},
    {title: 'Analysis Method (ClinVar)', prop: 'Method_ClinVar'},

    {title: 'ClinVar Accession', prop: 'ClinVarAccession_ENIGMA'},
    {title: 'Condition Category (ENIGMA)', prop: 'Condition_category_ENIGMA'},
    {title: 'Condition ID Type (ENIGMA)', prop: 'Condition_ID_type_ENIGMA'},
    {title: 'Condition ID Value (ENIGMA)', prop: 'Condition_ID_value_ENIGMA'},
    {title: 'Submitter (ClinVar)', prop: 'Submitter_ClinVar'},
    {title: 'URL (ENIGMA)', prop: 'URL_ENIGMA'},

    {title: 'African Allele Frequency (1000 Genomes)', prop: 'AFR_Allele_frequency_1000_Genomes'},
    {title: 'Allele Frequency', prop: 'Allele_Frequency'},
    {title: 'Allele Frequency (1000 Genomes)', prop: 'Allele_frequency_1000_Genomes'},
    {title: 'Allele Frequency (ExAC)', prop: 'Allele_frequency_ExAC'},
    {title: 'AMR Allele Frequency (1000 Genomes)', prop: 'AMR_Allele_frequency_1000_Genomes'},
    {title: 'EAS Allele Frequency (1000 Genomes)', prop: 'EAS_Allele_frequency_1000_Genomes'},
    {title: 'EUR Allele Frequency (1000 Genomes)', prop: 'EUR_Allele_frequency_1000_Genomes'},
    {title: 'Maximum Allele Frequency', prop: 'Max_Allele_Frequency'},
    {title: 'Allele Frequencies: EA|AA|All (ESP)', prop: 'Minor_allele_frequency_ESP'},
    {title: 'South Asian Allele Frequency (1000 Genomes)', prop: 'SAS_Allele_frequency_1000_Genomes'},
    {title: 'Variant Frequency (LOVD)', prop: 'Variant_frequency_LOVD'}

];

export var subColumns = [
    {
        subColTitle: "Variant Nomenclature",
        subColList: [
            {title: 'BIC Variant Identifier', prop: 'BIC_Nomenclature'},
            {title: 'Protein', prop: 'HGVS_Protein'},
            {title: 'SCV Accession (ClinVar)', prop: 'SCV_ClinVar'},
            {title: 'HGVS Nucleotide', prop: 'HGVS_cDNA'},
            {title: 'Protein Amino Acid Change', prop: 'Protein_Change'},
            {title: 'Reference cDNA Sequence', prop: 'Reference_Sequence'}
        ]
    },
    {
        subColTitle: "Origin",
        subColList: [
            {title: 'Allele Origin (ClinVar)', prop: 'Allele_Origin_ClinVar'},
            {title: 'Allele Origin (ENIGMA)', prop: 'Allele_origin_ENIGMA'},
            {title: 'Ethnicity (BIC)', prop: 'Ethnicity_BIC'},
            {title: 'Allele Origin (BIC)', prop: 'Germline_or_Somatic_BIC'},
            {title: 'Patient Nationality (BIC)', prop: 'Patient_nationality_BIC'},
            {title: 'Variant Haplotype (LOVD)', prop: 'Variant_haplotype_LOVD'}
        ]
    },

    {
        subColTitle: "Frequency",
        subColList: [
            {
                title: 'African Allele Frequency (1000 Genomes)',
                prop: 'AFR_Allele_frequency_1000_Genomes'
            },
            {title: 'Allele Frequency', prop: 'Allele_Frequency'},
            {title: 'Allele Frequency (1000 Genomes)', prop: 'Allele_frequency_1000_Genomes'},
            {title: 'Allele Frequency (ExAC)', prop: 'Allele_frequency_ExAC'},
            {
                title: 'AMR Allele Frequency (1000 Genomes)',
                prop: 'AMR_Allele_frequency_1000_Genomes'
            },
            {
                title: 'EAS Allele Frequency (1000 Genomes)',
                prop: 'EAS_Allele_frequency_1000_Genomes'
            },
            {
                title: 'EUR Allele Frequency (1000 Genomes)',
                prop: 'EUR_Allele_frequency_1000_Genomes'
            },
            {title: 'Maximum Allele Frequency', prop: 'Max_Allele_Frequency'},
            {title: 'Allele Frequencies: EA|AA|All (ESP)', prop: 'Minor_allele_frequency_ESP'},
            {
                title: 'South Asian Allele Frequency (1000 Genomes)',
                prop: 'SAS_Allele_frequency_1000_Genomes'
            },
            {title: 'Variant Frequency (LOVD)', prop: 'Variant_frequency_LOVD'}
        ]
    },

    {
        subColTitle: "Genomic",
        subColList: [
            {title: 'Gene Symbol', prop: 'Gene_Symbol'},
            {title: 'Genome (GRCh38)', prop: 'Genomic_Coordinate_hg38'},
            {title: 'Genome (GRCh36)', prop: 'Genomic_Coordinate_hg36'},
            {title: 'Genome (GRCh37)', prop: 'Genomic_Coordinate_hg37'}
        ]
    },
    {
        subColTitle: "Bioinformatic Annotation",
        subColList: [
            {title: 'Mutation category (BIC)', prop: 'Mutation_type_BIC'},
            {title: 'PolyPhen score', prop: 'PolyPhen_Score'},
            {title: 'SIFT score', prop: 'Sift_Score'}
        ]
    },
    {
        subColTitle: "Probability",
        subColList: [
            {title: 'Co-occurrence likelihood (exLOVD)', prop: 'Co_occurrence_LR_exLOVD'},
            {
                title: 'Prior probability of pathogenicity (exLOVD)',
                prop: 'Combined_prior_probablility_exLOVD'
            },
            {
                title: 'Missense analysis probability of pathogenicity (exLOVD)',
                prop: 'Missense_analysis_prior_probability_exLOVD'
            },
            {title: 'Probability of pathogenicity (exLOVD)', prop: 'Posterior_probability_exLOVD'},
            {title: 'Segregation Likelihood Ratio (exLOVD)', prop: 'Segregation_LR_exLOVD'},
            {
                title: 'Summary Family History Likelihood Ratio (exLOVD)',
                prop: 'Sum_family_LR_exLOVD'
            }
        ]
    },
    {
        subColTitle: "Significance",
        subColList: [
            {title: 'Pathogenicity', prop: 'Pathogenicity_all'},
            {title: 'Assertion Method (ENIGMA)', prop: 'Assertion_method_ENIGMA'},
            {title: 'Clinical Significance (BIC)', prop: 'Clinical_classification_BIC'},
            {title: 'Clinical Importance (BIC)', prop: 'Clinical_importance_BIC'},
            {title: 'Clinical Significance (ClinVar)', prop: 'Clinical_Significance_ClinVar'},
            {title: 'Clinical Significance (ENIGMA)', prop: 'Clinical_significance_ENIGMA'},
            {title: 'Collection Method (ENIGMA)', prop: 'Collection_method_ENIGMA'},
            {
                title: 'Comment on Clinical Significance (ENIGMA)',
                prop: 'Comment_on_clinical_significance_ENIGMA'
            },
            {title: 'Date last evaluated (ENIGMA)', prop: 'Date_last_evaluated_ENIGMA'},
            {title: 'Date last updated (ClinVar)', prop: 'Date_Last_Updated_ClinVar'},
            {title: 'Has Discordant Evidence', prop: 'Discordant'},
            {title: 'Functional Analysis Result (LOVD)', prop: 'Functional_analysis_result_LOVD'},
            {
                title: 'Functional Analysis Method (LOVD)',
                prop: 'Functional_analysis_technique_LOVD'
            },
            {title: 'Analysis Method (ClinVar)', prop: 'Method_ClinVar'}
        ]
    },
    {
        subColTitle: "Pedigree",
        subColList: [
            {
                title: 'Family members carrying this variant (BIC)',
                prop: 'Number_of_family_member_carrying_mutation_BIC'
            }
        ]
    },
    {
        subColTitle: "Publications",
        subColList: [
            {title: 'Assertion Method (ENIGMA)', prop: 'Assertion_method_citation_ENIGMA'},
            {
                title: 'Clinical Significance Citation (ENIGMA)',
                prop: 'Clinical_significance_citations_ENIGMA'
            },
            {title: 'Literature Reference (BIC)', prop: 'Literature_citation_BIC'},
            {title: 'Literature Reference (exLOVD)', prop: 'Literature_source_exLOVD'}
        ]
    },
    {
        subColTitle: "Source",
        subColList: [
            {title: 'ClinVar Accession', prop: 'ClinVarAccession_ENIGMA'},
            {title: 'Condition Category (ENIGMA)', prop: 'Condition_category_ENIGMA'},
            {title: 'Condition ID Type (ENIGMA)', prop: 'Condition_ID_type_ENIGMA'},
            {title: 'Condition ID Value (ENIGMA)', prop: 'Condition_ID_value_ENIGMA'},
            {title: 'Submitter (ClinVar)', prop: 'Submitter_ClinVar'},
            {title: 'URL (ENIGMA)', prop: 'URL_ENIGMA'},
            {title: 'Source(s)', prop: 'Source'},
            {title: 'Source URL(s)', prop: 'Source_URL'}
        ]
    },
];
