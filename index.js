import Sqlite from "./connectors/sql/Sqlite.js";
import Mysql from "./connectors/sql/Mysql.js";
export {default as Sqlite} from "./connectors/sql/Sqlite.js";
export {default as Mysql} from "./connectors/sql/mysql.js";

import Storable from "./utilities/storable.js";
import Collection from "./utilities/collection.js";
import Stub from "./utilities/stub.js";
import Type from "./utilities/type.js";
export {default as Storable} from "./utilities/storable.js";
export {default as Collection} from "./utilities/collection.js";
export {default as Stub} from "./utilities/stub.js";
export {default as Type} from "./utilities/type.js";

export default {
    Storable,
    Collection,
    Stub,
    Sqlite,
    Mysql
}

import DbRelation from "./types/relation.js";
import DbBoolean from "./types/boolean.js";
import DbString from "./types/string.js";
import DbDateTime from "./types/datetime.js";
import DbFloat from "./types/float.js";
import DbInteger from "./types/integer.js";
import DbJson from "./types/json.js";
import DbText from "./types/text.js";

export {default as DbRelation} from "./types/relation.js";
export {default as DbBoolean} from "./types/boolean.js";
export {default as DbString} from "./types/string.js";
export {default as DbDateTime} from "./types/datetime.js";
export {default as DbFloat} from "./types/float.js";
export {default as DbInteger} from "./types/integer.js";
export {default as DbJson} from "./types/json.js";
export {default as DbText} from "./types/text.js";

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