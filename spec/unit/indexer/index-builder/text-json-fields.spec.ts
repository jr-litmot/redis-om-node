import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


describe("Schema", () => {
  describe.each([

    ["that defines an unconfigured text for a JSON", {
      schemaDef: { aField: { type: 'text' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines a sorted text for a JSON", {
      schemaDef: { aField: { type: 'text', sortable: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'SORTABLE']
    }],

    ["that defines an unsorted text for a JSON", {
      schemaDef: { aField: { type: 'text', sortable: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines an indexed text for a JSON", {
      schemaDef: { aField: { type: 'text', indexed: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines an unindexed text for a JSON", {
      schemaDef: { aField: { type: 'text', indexed: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'NOINDEX']
    }],

    ["that defines a phonetic matcher text for a JSON", {
      schemaDef: { aField: { type: 'text', matcher: 'dm:en' } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'PHONETIC', 'dm:en']
    }],

    ["that defines a stemmed text for a JSON", {
      schemaDef: { aField: { type: 'text', stemming: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines an unstemmed text for a JSON", {
      schemaDef: { aField: { type: 'text', stemming: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'NOSTEM']
    }],

    ["that defines a normalized text for a JSON", {
      schemaDef: { aField: { type: 'text', normalized: true } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT']
    }],

    ["that defines an unnormalized text for a JSON", {
      schemaDef: { aField: { type: 'text', normalized: false } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'UNF']
    }],

    ["that defines a weighted text for a JSON", {
      schemaDef: { aField: { type: 'text', weight: 2 } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'WEIGHT', '2']
    }],

    ["that defines a fully configured text for a JSON", {
      schemaDef: { aField: { type: 'text', sortable: true, matcher: 'dm:en', stemming: false, normalized: false, weight: 2 } } as SchemaDefinition,
      dataStructure: 'JSON',
      expectedRedisSchema: ['$.aField', 'AS', 'aField', 'TEXT', 'NOSTEM', 'PHONETIC', 'dm:en', 'SORTABLE', 'UNF', 'WEIGHT', '2']
    }]

  ])("%s", (_, data) => {
    it("generates a Redis schema for the field", () => {
      let schemaDef = data.schemaDef
      let dataStructure = data.dataStructure as DataStructure
      let expectedRedisSchema = data.expectedRedisSchema

      let schema = new Schema('TestEntity', schemaDef, { dataStructure })
      let actual = buildRediSearchIndex(schema)
      expect(actual).toEqual(expectedRedisSchema)
    })
  })
})
