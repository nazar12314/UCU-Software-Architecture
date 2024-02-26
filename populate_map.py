from hazelcast import HazelcastClient


def populate_map(map, n: int) -> None:
    for key in range(n):
        map.put(key, f"Value_{key}")


if __name__ == "__main__":
    client = HazelcastClient(
        cluster_name="dev",
        cluster_members=["127.0.0.1:5702", "127.0.0.1:5701", "127.0.0.1:5703"]
    )

    map = client.get_map("distributed-map").blocking()

    populate_map(map, 1000)

    client.shutdown()
