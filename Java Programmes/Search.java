import java.util.Scanner;
import java.util.Vector;

public class Search {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {
            int total;
            int find;
            int num;
            Vector<Integer>mylist = new Vector<Integer>();

            total = scanner.nextInt();
            find = scanner.nextInt();

            for (int i=0; i<total; i++) {
                num = scanner.nextInt();
                mylist.add(num);
            }

            if (mylist.contains(find)) {
                for (int j=0; j<total; j++) {
                    if (mylist.elementAt(j)==find) {
                        System.out.println(j);
                        break;
                    }
                    else {
                        continue;
                    }
                }
            }
        }
    }
}
