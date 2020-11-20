import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateDatabase1605900469246 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "categories",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary:  true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "title",
                        type: "varchar"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "update_at",
                        type: "timestamp",
                        default: "now()"
                    }

                ]
            })

        );
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary:  true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "title",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "type",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "value",
                        type: "money",
                        isNullable: false
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "update_at",
                        type: "timestamp",
                        default: "now()"
                    }

                ]
            })

        );

       
        const foreignKeysArray: Array<TableForeignKey> = new Array();

        const foreignKey = new TableForeignKey({
            name: 'transactions_fk_category_id_from_category',
            columnNames: ['category_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'category',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        foreignKeysArray.push(foreignKey);

        await queryRunner.createForeignKeys('transactions', foreignKeysArray)
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions');
        await queryRunner.dropTable('categories');
    }

}
