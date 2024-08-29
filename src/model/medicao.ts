
import mongoose, { Model, Schema } from "mongoose"

interface IMedicao extends Document{
    measure_uuid: mongoose.Types.ObjectId;
    image_url: String
    measure_value: String
    measure_type: String
    customer_code: String
    measure_datatime: Date
    has_confirmed: Boolean
}

const medicaoSchema: Schema<IMedicao> = new mongoose.Schema({
    measure_uuid: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        unique: true,
        default: () => new mongoose.Types.ObjectId()
    },
    image_url: { type: String },
    measure_value: { type: String },
    measure_type: { type: String },
    customer_code: { type: String },
    measure_datatime: { type: Date },
    has_confirmed: { type: Boolean }
},{
    versionKey: false
})
const medicao: Model<IMedicao> = mongoose.model<IMedicao>('medicao', medicaoSchema)

export { medicao, medicaoSchema, IMedicao }