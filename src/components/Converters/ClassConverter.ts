import { SpecialCharacterHelper } from '../../helpers/SpecialCharacterHelper';
import { TypeHelper } from '../../helpers/TypeHelper';
import { RecordType } from '../../interfaces/AvroSchema';
import { ExportModel } from '../../models/ExportModel';
import { RecordConverter } from './RecordConverter';

export class ClassConverter extends RecordConverter {
  protected interfaceRows: string[] = [];
  protected interfaceSuffix = 'Interface';
  protected TAB = SpecialCharacterHelper.TAB;

  protected classRows: string[] = [];
  protected importRows: string[] = [];

  public convert(data: any): any {
    data = this.getData(data) as RecordType;

    this.classRows.push(...this.extractClass(data));
    this.importRows.push(...this.extractImports());

    this.getExportModels(data);

    return;
  }

  protected getExportModels(data: RecordType): ExportModel {
    const importExportModel: ExportModel = new ExportModel();
    const classExportModel: ExportModel = new ExportModel();
    const interfaceExportModel: ExportModel = new ExportModel();

    importExportModel.name = 'imports';
    importExportModel.content = this.importRows.join(
      SpecialCharacterHelper.NEW_LINE
    );

    classExportModel.name = data.name;
    classExportModel.content = this.classRows.join(
      SpecialCharacterHelper.NEW_LINE
    );

    interfaceExportModel.name = data.name + this.interfaceSuffix;
    interfaceExportModel.content = this.interfaceRows.join(
      SpecialCharacterHelper.NEW_LINE
    );

    this.exports = [importExportModel, interfaceExportModel, classExportModel];

    return classExportModel;
  }

  protected extractImports(): string[] {
    const rows: string[] = [];

    for (const enumFile of this.enumExports) {
      const importLine = `import { ${enumFile.name} } from './${enumFile.name}Enum';`;
      rows.push(importLine);
    }

    return rows;
  }

  protected extractClass(data: RecordType): string[] {
    const rows: string[] = [];
    const interfaceRows: string[] = [];
    const TAB = SpecialCharacterHelper.TAB;

    interfaceRows.push(
      `export interface ${data.name}${this.interfaceSuffix} {`
    );

    rows.push(
      `export const ${data.name}Schema = ${JSON.stringify(data, null, 4)};`
    );
    rows.push(``);

    for (const field of data.fields) {
      let fieldType;

      // If the type was defined earlier, fetch the entire thing from the cache.
      const type = this.recordCache[field.type.toString()] || field.type;

      if (TypeHelper.hasDefault(field) || TypeHelper.isOptional(field.type)) {
        fieldType = `${this.getField(field.name, type)}`;
      } else {
        const convertedType = this.convertType(type);
        fieldType = `${field.name}: ${convertedType}`;
      }

      interfaceRows.push(`${this.TAB}${fieldType};`);
    }

    interfaceRows.push('}');
    this.interfaceRows.push(...interfaceRows);

    return rows;
  }
}
