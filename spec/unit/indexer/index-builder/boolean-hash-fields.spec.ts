import { Schema, SchemaDefinition, DataStructure } from '$lib/schema'
import { buildRediSearchIndex } from '$lib/indexer'


describe("#buildRediSearchIndex", () => {
  describe.each([

    ["that defines an unconfigured boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG']
    }],

    ["that defines an aliased boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField' } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG']
    }],

    ["that defines a sorted boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', sortable: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'SORTABLE']
    }],

    ["that defines an unsorted boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', sortable: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG']
    }],

    ["that defines an indexed boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', indexed: true } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG']
    }],

    ["that defines an unidexed boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['aField', 'TAG', 'NOINDEX']
    }],

    ["that defines a fully configured boolean for a HASH", {
      schemaDef: { aField: { type: 'boolean', alias: 'anotherField', sortable: true, indexed: false } } as SchemaDefinition,
      dataStructure: 'HASH',
      expectedRedisSchema: ['anotherField', 'TAG', 'SORTABLE', 'NOINDEX']
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
