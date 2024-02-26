from hazelcast import HazelcastClient
import threading


def without_lock(map, key: str, iterations: int) -> None:
    map.clear()
    map.put_if_absent("key", 0)

    for _ in range(iterations):
        current_value = map.get(key)
        map.put(key, current_value + 1)


def run_client(client_id: int):
    client = HazelcastClient(
        cluster_name="dev",
        cluster_members=["127.0.0.1:5701"]
    )

    my_map = client.get_map("distributed-map").blocking()

    without_lock(my_map, "key", 10000)

    final_value = my_map.get("key")

    print(f"Final value for client {client_id}: {final_value}")

    client.shutdown()


if __name__ == "__main__":
    thread1 = threading.Thread(target=run_client, args=(1,))
    thread2 = threading.Thread(target=run_client, args=(2,))
    thread3 = threading.Thread(target=run_client, args=(3,))

    thread1.start()
    thread2.start()
    thread3.start()

    thread1.join()
    thread2.join()
    thread3.join()

    client = HazelcastClient()

    my_map = client.get_map("distributed-map").blocking()

    final_value = my_map.get("key")

    print(f"Final value: {final_value}")

    client.shutdown()
