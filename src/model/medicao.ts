
import mongoose, { Model, Schema } from "mongoose"
import { v4 as uuidv4 } from 'uuid'

interface IMedicao extends Document{
    id: mongoose.Schema.Types.ObjectId
    measure_uuid: String;
    image_url: String
    measure_value: String
    measure_type: String
    customer_code: String
    measure_datatime: Date
    has_confirmed: Boolean
}

const medicaoSchema: Schema<IMedicao> = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId },
    measure_uuid: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => uuidv4()
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