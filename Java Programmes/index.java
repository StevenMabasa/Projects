import java.util.Scanner;
import java.util.Vector;

public class index {
    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total = scanner.nextInt();
            int key = scanner.nextInt();
            int num;

            Vector<Integer> mylist = new Vector<Integer>();

            for (int i = 0; i < total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            int start_index = -1;
            int end_index = -1;

            for (int i = 0; i < mylist.size(); i++) {
                if (mylist.elementAt(i) == key) {
                    if (start_index == -1) {
                        start_index = i;
                    }
                    // Always update the end_index, even if it's the same as start_index
                    end_index = i;
                }
            }

            if (start_index == -1 && end_index == -1) {
                System.out.println("-1");
            } else {
                System.out.println("Start: " + start_index);
                System.out.println("End: " + end_index);
            }
        }
    }
}
