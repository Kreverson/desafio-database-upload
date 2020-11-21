import {MigrationInterface, QueryRunner, TableForeignKey, Table} from "typeorm";

export class createforeignKey1605915484056 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.createForeignKey('transactions',  new TableForeignKey({
            name: 'transactions',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'categories',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable("transactions");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("category_id") !== -1);
        
        if(foreignKey)
            await queryRunner.dropForeignKey('transactions', foreignKey);
    }

}
