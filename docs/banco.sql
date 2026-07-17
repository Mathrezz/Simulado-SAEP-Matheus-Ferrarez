CREATE TABLE IF NOT EXISTS "produtos" (
	"id" SERIAL NOT NULL,
	"nome" VARCHAR(255) NOT NULL,
	"categoria" VARCHAR(255) NOT NULL,
	"estoque" NUMERIC NOT NULL,
	"valor" DECIMAL NOT NULL,
	PRIMARY KEY("id")
);




CREATE TABLE IF NOT EXISTS "movimentacao" (
	"id" SERIAL,
	"entrada" DATE NOT NULL,
	"saida" DATE NOT NULL,
	PRIMARY KEY("entrada")
);



ALTER TABLE "movimentacao"
ADD FOREIGN KEY("id") REFERENCES "produtos"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

