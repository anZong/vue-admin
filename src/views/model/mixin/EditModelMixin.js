import { getModelList, getModelFields, getInstance } from '@/api/base'

export default {
  methods: {
    getData: async function(params = {}) {
      const res = await getInstance(Object.assign(params, this.baseData, { editPage: true }))
      if (res.data.hasOwnProperty('permissions')) {
        res.data.permissions = res.data.permissions.split(',')
      }
      this.temp = res.data
      this.temp.id = params.id
    },
    async getEditFields(params = {}) {
      const res = await getModelFields(Object.assign(params, this.baseData, { editPage: true }))
      const fields = res.data.fields
      fields.map(async field => {
        if (field.depend) {
          const depend_field = fields.find((v) => {
            return v.name === field.depend
          })
          depend_field.related = field.name
          if (depend_field.choices.length) {
            field.choices = await this.getOptions(field, { [field.query_key]: depend_field.choices[0].key })
          }
        }
      })
      // for (const index in fields) {
      //   const field = fields[index]
      //   const types = ['ForeignKey', 'DataDicField', 'DataDicsField', 'ManyToManyField']
      //   if (types.includes(field.type)) {
      //     field.choices = await this.getOptions(field)
      //   }
      // }
      return fields
    },
    async getOptions(field, params = {}) {
      if (Object.keys(field.choices).length) {
        return
      }
      params = Object.assign(params, {
        app_label: field.to_app,
        modelname: field.to,
        size: -1
      })
      if (field.dtype) {
        params['dtype'] = field.dtype
      }
      const res = await getModelList(params)
      const choices = []
      res.data.list.map(v => {
        choices.push({
          key: v.id,
          value: v.__str__
        })
      })
      return choices
    }
  }
}
