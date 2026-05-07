import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InsightDocument = Insight & Document;

@Schema({
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours',
  },
  timestamps: true,
})
export class Insight {
  @Prop({ required: true, type: Date })
  timestamp: Date;

  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  type: string; // e.g., 'AT_RISK_PREDICTION', 'PERFORMANCE_TREND'

  @Prop({ required: true, type: Number })
  score: number; // e.g., 0.85

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: Record<string, any>;

  @Prop({ type: MongooseSchema.Types.Mixed })
  details: Record<string, any>;
}

export const InsightSchema = SchemaFactory.createForClass(Insight);
