import { connManager } from "./TestHelper";

describe("OracleConnectionManager", (): void => {
  test("should get a OracleConnection", async (): Promise<void> => {
    return connManager.getConnection().then((conn) => {
      expect(conn.getAutoCommit()).toBeTruthy();

      conn.closeSync();
    });
  });

  test("should be able to set auto-commit false", async (): Promise<void> => {
    return connManager.getConnection().then((conn) => {
      expect(conn.getAutoCommit()).toBeTruthy();

      conn.setAutoCommit(false);

      expect(conn.getAutoCommit()).toBeFalsy();

      conn.closeSync();
    });
  });

  test("should be closed after close method called", async (): Promise<void> => {
    return connManager.getConnection().then((conn) => {
      conn.closeSync();

      expect(conn.isClosed()).toBeTruthy();
    });
  });

  test("should be open at first", async (): Promise<void> => {
    return connManager.getConnection().then((conn) => {
      expect(conn.isClosed()).toBeFalsy();
    });
  });
});
