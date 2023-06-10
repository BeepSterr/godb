import Sqlite from "./connectors/sql/Sqlite.js";
import Mysql from "./connectors/sql/Mysql.js";
import Http from "./connectors/web/Http.js";
export {default as Sqlite} from "./connectors/sql/Sqlite.js";
export {default as Mysql} from "./connectors/sql/Mysql.js";
export {default as Http} from "./connectors/web/Http.js";

import Storable from "./utilities/Storable.js";
import Collection from "./utilities/Collection.js";
import Stub from "./utilities/Stub.js";
import Type from "./utilities/Type.js";
export {default as Storable} from "./utilities/Storable.js";
export {default as Collection} from "./utilities/Collection.js";
export {default as Stub} from "./utilities/Stub.js";
export {default as Type} from "./utilities/Type.js";

export default {
    Storable,
    Collection,
    Stub,
    Sqlite,
    Mysql,
    Http
}

import DbRelation from "./types/Relation.js";
import DbBoolean from "./types/Boolean.js";
import DbString from "./types/String.js";
import DbDateTime from "./types/DateTime.js";
import DbFloat from "./types/Float.js";
import DbInteger from "./types/Integer.js";
import DbJson from "./types/Json.js";
import DbText from "./types/Text.js";

export {default as DbRelation} from "./types/Relation.js";
export {default as DbBoolean} from "./types/Boolean.js";
export {default as DbString} from "./types/String.js";
export {default as DbDateTime} from "./types/DateTime.js";
export {default as DbFloat} from "./types/Float.js";
export {default as DbInteger} from "./types/Integer.js";
export {default as DbJson} from "./types/Json.js";
export {default as DbText} from "./types/Text.js";

export const types = {
    DbString,
    DbText,
    DbJson,
    DbInteger,
    DbFloat,
    DbBoolean,
    DbDateTime,
    DbRelation
}